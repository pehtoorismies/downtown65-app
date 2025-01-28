import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// sst.config.ts
import { RemovalPolicy as RemovalPolicy3 } from "aws-cdk-lib";

// stacks/config-stack.ts
import { Config } from "sst/constructs";
var DEVELOPMENT = {
  AUTH_CLIENT_ID: "JaoAht7ggce7f5R8DCBGUyjUJeMQEDtz",
  AUTH_DOMAIN: "dev-dt65.eu.auth0.com",
  JWT_AUDIENCE: "https://graphql-dev.downtown65.com"
};
var PRODUCTION = {
  AUTH_CLIENT_ID: "uPu5NUyP1yaGw2IAC0B1KeCgbX3FaNzz",
  AUTH_DOMAIN: "prod-dt65.eu.auth0.com",
  JWT_AUDIENCE: "https://graphql-api.downtown65.com/"
};
var ConfigStack = /* @__PURE__ */ __name(({ app, stack }) => {
  const authConfig = app.stage === "production" ? PRODUCTION : DEVELOPMENT;
  const getStaticConfig = /* @__PURE__ */ __name((key) => new Config.Parameter(stack, key, {
    value: authConfig[key]
  }), "getStaticConfig");
  return {
    AUTH_CLIENT_ID: getStaticConfig("AUTH_CLIENT_ID"),
    // Auth0 Client Application secret
    AUTH_CLIENT_SECRET: new Config.Secret(stack, "AUTH_CLIENT_SECRET"),
    AUTH_DOMAIN: getStaticConfig("AUTH_DOMAIN"),
    JWT_AUDIENCE: getStaticConfig("JWT_AUDIENCE"),
    // secret string required when user fills the form to register to downtown65.events
    REGISTER_SECRET: new Config.Secret(stack, "REGISTER_SECRET"),
    // secret setting cookies in frontend
    COOKIE_SECRET: new Config.Secret(stack, "COOKIE_SECRET")
  };
}, "ConfigStack");

// stacks/cron-stack.ts
import { Cron, Function, use } from "sst/constructs";

// stacks/support/get-domain-stage.ts
var getDomainStage = /* @__PURE__ */ __name((stage) => {
  if (stage === "production") {
    return {
      accountType: "production",
      domainName: "downtown65.events"
    };
  }
  if (stage.startsWith("pr-")) {
    const result = stage.match(/^pr-(?<prId>\d+)$/);
    if (result?.groups == null) {
      throw new Error(`Malformatted stage: ${stage}. Use: pr-<pr-id>`);
    }
    if (result.groups["prId"] == null) {
      throw new Error(`Malformatted stage pr-id: ${stage}. Use: pr-<pr-id>`);
    }
    const prId = Number(result.groups["prId"]);
    return {
      accountType: "staging",
      domainName: `pr-${prId}.staging.downtown65.events`
    };
  }
  return {
    accountType: "dev"
  };
}, "getDomainStage");

// stacks/cron-stack.ts
var CronStack = /* @__PURE__ */ __name(({ app, stack }) => {
  const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN } = use(ConfigStack);
  const domainStage = getDomainStage(app.stage);
  if (domainStage.accountType === "production") {
    const weeklyEmailFun = new Function(stack, "WeeklyEmail", {
      handler: "apps/backend/src/cron-send-weekly-email/lambda.handler",
      bind: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
      environment: {
        DOMAIN_NAME: domainStage.domainName
      },
      permissions: ["ses:SendEmail", "ses:SendRawEmail"]
    });
    new Cron(stack, "WeeklyEmailCron", {
      // https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
      schedule: "cron(0 10 ? * MON *)",
      job: weeklyEmailFun,
      enabled: false
    });
  }
}, "CronStack");

// stacks/dynamo-stack.ts
import { RemovalPolicy } from "aws-cdk-lib";
import backup from "aws-cdk-lib/aws-backup";
import dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Config as Config2, Table } from "sst/constructs";
var DynamoStack = /* @__PURE__ */ __name(({ app, stack }) => {
  const removalPolicy = app.stage === "production" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;
  const table = new Table(stack, "dt65Table", {
    fields: {
      PK: "string",
      SK: "string",
      GSI1PK: "string",
      GSI1SK: "string"
    },
    primaryIndex: { partitionKey: "PK", sortKey: "SK" },
    globalIndexes: {
      GSI1: { partitionKey: "GSI1PK", sortKey: "GSI1SK" }
    },
    stream: true,
    cdk: {
      table: {
        removalPolicy
      }
    }
  });
  if (app.stage === "production") {
    const productionTable = dynamodb.Table.fromTableName(
      stack,
      "dt65Table-prod-table",
      table.tableName
    );
    const plan = backup.BackupPlan.dailyMonthly1YearRetention(
      stack,
      "Production-Plan"
    );
    plan.addSelection("Selection", {
      resources: [backup.BackupResource.fromDynamoDbTable(productionTable)]
    });
  }
  return {
    table,
    TABLE_NAME: new Config2.Parameter(stack, "TABLE_NAME", {
      value: table.tableName
    })
  };
}, "DynamoStack");

// stacks/dynamo-stream-stack.ts
import { Function as Function2, use as use2 } from "sst/constructs";
var DynamoStreamStack = /* @__PURE__ */ __name(({ app, stack }) => {
  const domainStage = getDomainStage(app.stage);
  if (domainStage.accountType === "dev") {
    return;
  }
  const dynamo = use2(DynamoStack);
  const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN } = use2(ConfigStack);
  const eventCreatedFunction = new Function2(stack, "EventCreated", {
    handler: "apps/backend/src/dynamo-stream-event-created/lambda.handler",
    bind: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
    permissions: ["ses:SendEmail", "ses:SendRawEmail"],
    environment: {
      DOMAIN_NAME: domainStage.domainName
    },
    nodejs: {
      // needed for mjml library to work
      // https://github.com/mjmlio/mjml/issues/2132
      install: ["uglify-js"],
      // needed for mjml library to work
      esbuild: {
        loader: {
          ".mjml": "text"
        }
      }
    }
  });
  dynamo.table.addConsumers(stack, {
    eventCreated: {
      function: eventCreatedFunction,
      // https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html#filtering-examples
      filters: [
        {
          eventName: ["INSERT"],
          dynamodb: {
            // "Keys": {...},
            // "NewImage": {...},
            // "OldImage": {...}
            NewImage: {
              _et: {
                // pick only Dt65Event entity types
                S: ["Dt65Event"]
              }
            }
          }
        }
      ]
    }
  });
}, "DynamoStreamStack");

// stacks/graphql-stack.ts
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as cdk from "aws-cdk-lib";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { AppSyncApi, Function as Function3, use as use3 } from "sst/constructs";

// stacks/media-bucket-stack.ts
import { RemovalPolicy as RemovalPolicy2 } from "aws-cdk-lib";
import cloudfront, {
  AllowedMethods,
  CachePolicy,
  ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket, Config as Config3 } from "sst/constructs";
var MediaBucketStack = /* @__PURE__ */ __name(({ app, stack }) => {
  const removalPolicy = app.stage === "production" ? RemovalPolicy2.RETAIN : RemovalPolicy2.DESTROY;
  const autoDeleteObjects = app.stage !== "production";
  const bucket = new Bucket(stack, "mediaBucket", {
    cdk: {
      bucket: {
        autoDeleteObjects,
        removalPolicy
      }
    }
  });
  const mediaCloudFront = new cloudfront.Distribution(
    stack,
    "mediaDistribution",
    {
      defaultBehavior: {
        origin: new S3Origin(bucket.cdk.bucket),
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD
      },
      comment: `Serve from S3 media ${app.stage}`
    }
  );
  mediaCloudFront.applyRemovalPolicy(
    app.stage === "production" ? RemovalPolicy2.RETAIN : RemovalPolicy2.DESTROY
  );
  stack.addOutputs({
    mediaBucketName: bucket.bucketName
  });
  return {
    MEDIA_BUCKET_NAME: new Config3.Parameter(stack, "MEDIA_BUCKET_NAME", {
      value: bucket.bucketName
    }),
    MEDIA_BUCKET_DOMAIN: new Config3.Parameter(stack, "MEDIA_BUCKET_DOMAIN", {
      value: mediaCloudFront.distributionDomainName
    }),
    mediaBucket: bucket
  };
}, "MediaBucketStack");

// stacks/graphql-stack.ts
var GraphqlStack = /* @__PURE__ */ __name(({ app, stack }) => {
  const { TABLE_NAME, table } = use3(DynamoStack);
  const { MEDIA_BUCKET_NAME, MEDIA_BUCKET_DOMAIN, mediaBucket } = use3(MediaBucketStack);
  const {
    AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET,
    AUTH_DOMAIN,
    JWT_AUDIENCE,
    REGISTER_SECRET
  } = use3(ConfigStack);
  const gqlFunction = new Function3(stack, "AppSyncApiFunction", {
    handler: "apps/backend/src/graphql-appsync/lambda.handler",
    bind: [
      AUTH_CLIENT_ID,
      AUTH_CLIENT_SECRET,
      AUTH_DOMAIN,
      JWT_AUDIENCE,
      REGISTER_SECRET,
      TABLE_NAME,
      MEDIA_BUCKET_DOMAIN,
      MEDIA_BUCKET_NAME
    ]
  });
  gqlFunction.attachPermissions([mediaBucket]);
  const gqlApi = new AppSyncApi(stack, "AppSyncApi", {
    schema: "apps/backend/src/graphql-appsync/schema.graphql",
    cdk: {
      graphqlApi: {
        logConfig: {
          excludeVerboseContent: false,
          fieldLogLevel: app.stage === "production" ? appsync.FieldLogLevel.ERROR : appsync.FieldLogLevel.ALL,
          retention: app.stage === "production" ? RetentionDays.TWO_MONTHS : RetentionDays.THREE_DAYS
        },
        xrayEnabled: false,
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.OIDC,
            openIdConnectConfig: {
              oidcProvider: `https://${AUTH_DOMAIN.value}`
            }
          },
          additionalAuthorizationModes: [
            {
              authorizationType: appsync.AuthorizationType.API_KEY,
              apiKeyConfig: {
                expires: cdk.Expiration.after(cdk.Duration.days(365))
              }
            }
          ]
        }
      }
    },
    dataSources: {
      gql: gqlFunction
    },
    resolvers: {
      "Query    event": "gql",
      "Query    events": "gql",
      "Query    challenge": "gql",
      "Query    challenges": "gql",
      "Query    me": "gql",
      "Query    users": "gql",
      "Query    user": "gql",
      "Mutation createEvent": "gql",
      "Mutation updateEvent": "gql",
      "Mutation deleteEvent": "gql",
      "Mutation leaveEvent": "gql",
      "Mutation participateEvent": "gql",
      "Mutation updateMe": "gql",
      "Mutation updateAvatar": "gql",
      "Mutation login": "gql",
      "Mutation signup": "gql",
      "Mutation refreshToken": "gql",
      "Mutation forgotPassword": "gql",
      "Mutation createChallenge": "gql",
      "Mutation participateChallenge": "gql",
      "Mutation leaveChallenge": "gql",
      "Mutation addChallengeAccomplishment": "gql",
      "Mutation removeChallengeAccomplishment": "gql"
    }
  });
  gqlApi.attachPermissions([table]);
  const ApiId = gqlApi.apiId;
  const ApiKey = gqlApi.cdk.graphqlApi.apiKey || "No api key received";
  const ApiUrl = gqlApi.url;
  stack.addOutputs({
    ApiId,
    ApiUrl
  });
  return {
    ApiKey,
    ApiUrl
  };
}, "GraphqlStack");

// stacks/layer-stack.ts
import * as lambda from "aws-cdk-lib/aws-lambda";
var LayerStack = /* @__PURE__ */ __name(({ stack }) => {
  const sharpLayer = new lambda.LayerVersion(stack, "AppLayer", {
    code: lambda.Code.fromAsset("stacks/layers/sharp")
    // compatibleArchitectures: [lambda.Architecture.ARM_64],
  });
  stack.addOutputs({
    SHARP_LAYER_ARN: sharpLayer.layerVersionArn
  });
  return {
    SHARP_LAYER: sharpLayer
  };
}, "LayerStack");

// stacks/remix-stack.ts
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as lambda2 from "aws-cdk-lib/aws-lambda";
import * as route53 from "aws-cdk-lib/aws-route53";
import { RemixSite, use as use4 } from "sst/constructs";
var getCustomDomain = /* @__PURE__ */ __name(({ app, stack }) => {
  const { stage } = app;
  const domainStage = getDomainStage(stage);
  switch (domainStage.accountType) {
    case "production": {
      const hostedZone = route53.HostedZone.fromLookup(stack, "HostedZone", {
        domainName: "downtown65.events"
      });
      return {
        domainName: "downtown65.events",
        domainAlias: "www.downtown65.events",
        cdk: {
          hostedZone,
          certificate: new acm.DnsValidatedCertificate(stack, "Certificate", {
            domainName: "downtown65.events",
            hostedZone,
            region: "us-east-1",
            subjectAlternativeNames: ["*.downtown65.events"]
          })
        }
      };
    }
    case "staging": {
      const hostedZone = route53.HostedZone.fromLookup(stack, "HostedZone", {
        domainName: "staging.downtown65.events"
      });
      return {
        domainName: domainStage.domainName,
        cdk: {
          hostedZone,
          certificate: new acm.DnsValidatedCertificate(stack, "Certificate", {
            domainName: "staging.downtown65.events",
            hostedZone,
            region: "us-east-1",
            subjectAlternativeNames: ["*.staging.downtown65.events"]
          })
        }
      };
    }
    case "dev": {
      return;
    }
  }
}, "getCustomDomain");
var RemixStack = /* @__PURE__ */ __name((stackContext) => {
  const { stack, app } = stackContext;
  const { stage, mode } = app;
  const { ApiUrl, ApiKey } = use4(GraphqlStack);
  const { COOKIE_SECRET } = use4(ConfigStack);
  const { MEDIA_BUCKET_NAME, MEDIA_BUCKET_DOMAIN, mediaBucket } = use4(MediaBucketStack);
  const sharpLayer = new lambda2.LayerVersion(stack, `${stage}-SharpLayer'`, {
    code: lambda2.Code.fromAsset("stacks/layers/sharp"),
    compatibleArchitectures: [lambda2.Architecture.ARM_64]
  });
  const customDomain = getCustomDomain(stackContext);
  const site = new RemixSite(stack, "Downtown65-remix", {
    path: "apps/web",
    bind: [COOKIE_SECRET],
    warm: stage === "production" ? 5 : void 0,
    environment: {
      API_URL: ApiUrl,
      API_KEY: ApiKey,
      // TODO: SMELL localhost
      DOMAIN_NAME: customDomain?.domainName ?? "localhost:3000",
      STORAGE_BUCKET: MEDIA_BUCKET_NAME.value,
      MEDIA_DOMAIN: MEDIA_BUCKET_DOMAIN.value,
      APP_MODE: mode,
      APP_STAGE: stage
    },
    customDomain,
    nodejs: {
      esbuild: {
        external: ["sharp"]
      }
    }
  });
  site.attachPermissions([mediaBucket]);
  const serverHandler = site.cdk?.function;
  if (serverHandler) {
    serverHandler.addLayers(sharpLayer);
  }
  stack.addOutputs({
    WebsiteUrl: site.url ?? "localhost",
    CustomDomainUrl: site.customDomainUrl ?? "no_custom_domain",
    FuncArn: site.cdk?.function?.functionArn ?? "no_func_arn"
  });
}, "RemixStack");

// sst.config.ts
function getProfile(stage) {
  if (stage === "production") {
    return "downtown65-production";
  }
  if (stage?.startsWith("pr-")) {
    return "downtown65-staging";
  }
  return "downtown65-development";
}
__name(getProfile, "getProfile");
var sst_config_default = {
  config(input) {
    return {
      name: "downtown65-app",
      region: "eu-north-1",
      profile: getProfile(input.stage)
    };
  },
  stacks(app) {
    if (app.stage !== "production") {
      app.setDefaultRemovalPolicy(RemovalPolicy3.DESTROY);
    }
    app.setDefaultFunctionProps({
      environment: {
        APP_MODE: app.mode,
        APP_STAGE: app.stage
      },
      runtime: "nodejs18.x",
      logRetention: app.stage === "production" ? "two_months" : "three_days"
    });
    app.stack(ConfigStack).stack(LayerStack).stack(MediaBucketStack).stack(DynamoStack).stack(DynamoStreamStack).stack(CronStack).stack(GraphqlStack).stack(RemixStack);
  }
};
export {
  sst_config_default as default
};
