import {
  createStyles,
  Header,
  Group,
  Button,
  Text,
  Divider,
  Box,
  Burger,
  Avatar,
  Drawer,
  UnstyledButton,
  Menu,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link } from '@remix-run/react'
import { IconChevronDown, IconLogout, IconUser } from '@tabler/icons'
import { useState } from 'react'
import type { User } from '~/domain/user'

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('sm')]: {
      height: 42,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
    },
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  user: {
    color: theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colors.blue[1],
    },
  },

  userActive: {
    backgroundColor: theme.colors.blue[1],
  },
}))

interface Props {
  user?: User
}

export const HeaderMenu = ({ user }: Props) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false)
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const { classes, cx } = useStyles()

  return (
    <Box>
      <Header height={60} px="md" fixed>
        <Group position="apart" sx={{ height: '100%' }}>
          <Group>
            {user && (
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                className={classes.hiddenDesktop}
              />
            )}
            <Text>Downtown65</Text>
          </Group>
          {user && (
            <Group className={classes.hiddenMobile}>
              <Link
                to="/events"
                className={cx(classes.link, {
                  [classes.linkActive]: false,
                })}
              >
                Tapahtumat
              </Link>
            </Group>
          )}
          {user && (
            <Menu
              width={160}
              position="bottom-end"
              transition="pop-top-right"
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    <Avatar
                      src={user.picture}
                      alt={user.nickname}
                      radius="xl"
                      size={20}
                    />
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user.nickname}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  to="/profile"
                  icon={<IconUser size={14} stroke={1.5} />}
                >
                  Profiili
                </Menu.Item>
                <Menu.Item
                  component={Link}
                  to="/logout"
                  icon={<IconLogout size={14} stroke={1.5} />}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}

          {!user && (
            <Group className={classes.hiddenMobile}>
              <Button component={Link} to="/login" variant="default">
                Kirjaudu
              </Button>
              <Button component={Link} to="/signup">
                Rekisteröidy
              </Button>
            </Group>
          )}
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigaatio"
        className={classes.hiddenDesktop}
        zIndex={1_000_000}
      >
        <Divider my="sm" color="gray.1" />
        <Link
          to="/events"
          onClick={closeDrawer}
          className={cx(classes.link, {
            [classes.linkActive]: false,
          })}
        >
          Tapahtumat
        </Link>
        <Link
          to="/events/new"
          onClick={closeDrawer}
          className={cx(classes.link, {
            [classes.linkActive]: false,
          })}
        >
          Luo uusi tapahtuma
        </Link>
        <Link
          to="/profile"
          onClick={closeDrawer}
          className={cx(classes.link, {
            [classes.linkActive]: false,
          })}
        >
          Profiili
        </Link>
        <Link
          to="/users"
          onClick={closeDrawer}
          className={cx(classes.link, {
            [classes.linkActive]: false,
          })}
        >
          Käyttäjät
        </Link>
        {!user && (
          <Group position="center" grow pb="xl" px="md">
            <Button variant="default">Kirjaudu</Button>
            <Button>Rekisteröidy</Button>
          </Group>
        )}
      </Drawer>
    </Box>
  )
}
