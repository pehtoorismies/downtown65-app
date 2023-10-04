import type { User } from '~/domain/user'

// const useStyles = createStyles((theme) => ({
//   link: {
//     paddingTop: 3,
//     paddingBottom: 3,
//     paddingLeft: theme.spacing.sm,
//     paddingRight: theme.spacing.sm,
//     textDecoration: 'none',
//     color: theme.black,
//     fontWeight: 500,
//     fontSize: theme.fontSizes.sm,
//
//     [theme.fn.smallerThan('sm')]: {
//       height: 42,
//       display: 'flex',
//       alignItems: 'center',
//       width: '100%',
//     },
//
//     ...theme.fn.hover({
//       backgroundColor:
//         theme.colorScheme === 'dark'
//           ? theme.colors.dark[6]
//           : theme.colors.gray[0],
//     }),
//   },
//
//   linkActive: {
//     '&, &:hover': {
//       backgroundColor: theme.fn.variant({
//         variant: 'light',
//         color: theme.primaryColor,
//       }).background,
//       color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
//         .color,
//     },
//   },
//
//   hiddenMobile: {
//     [theme.fn.smallerThan('sm')]: {
//       display: 'none',
//     },
//   },
//
//   hiddenDesktop: {
//     [theme.fn.largerThan('sm')]: {
//       display: 'none',
//     },
//   },
//
//   user: {
//     color: theme.black,
//     padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
//     borderRadius: theme.radius.sm,
//     transition: 'background-color 100ms ease',
//
//     '&:hover': {
//       backgroundColor: theme.colors.blue[1],
//     },
//   },
//
//   userActive: {
//     backgroundColor: theme.colors.blue[1],
//   },
// }))

interface Props {
  user: User
}

const navLinks = [
  { id: 10, title: 'Tapahtumat', to: '/events' },
  {
    id: 30,
    title: 'Luo uusi',
    to: '/events/new',
    testId: 'nav-create-new-event',
  },
  { id: 40, title: 'Jäsenet', to: '/members' },
]

export const HeaderLoggedIn = ({ user }: Props) => {
  return 'moi'
}

//
// export const HeaderLoggedIn = ({ user }: Props) => {
//   const fetcher = useFetcher()
//   const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
//     useDisclosure(false)
//   const [userMenuOpened, setUserMenuOpened] = useState(false)
//   // const { classes, cx } = useStyles()
//
//   return (
//     <Box>
//       {/*<Header height={60} px="md" fixed>*/}
//       <Group justify="space-between" style={{ height: '100%' }}>
//         <Group>
//           <Burger
//             opened={drawerOpened}
//             onClick={toggleDrawer}
//             visibleFrom="sm"
//           />
//           <Text style={{ userSelect: 'none' }}>Dt65 Events</Text>
//         </Group>
//         <Group className={classes.hiddenMobile}>
//           {navLinks.map(({ id, to, title, testId }) => (
//             <NavLink
//               key={id}
//               end
//               to={to}
//               className={({ isActive }) => {
//                 return cx(classes.link, {
//                   [classes.linkActive]: isActive,
//                 })
//               }}
//               data-testid={testId}
//             >
//               {title}
//             </NavLink>
//           ))}
//         </Group>
//
//         <Menu
//           width={160}
//           position="bottom-end"
//           transitionProps={{ transition: 'pop-top-right' }}
//           onClose={() => setUserMenuOpened(false)}
//           onOpen={() => setUserMenuOpened(true)}
//         >
//           <Menu.Target>
//             <UnstyledButton
//               className={cx(classes.user, {
//                 [classes.userActive]: userMenuOpened,
//               })}
//             >
//               <Group gap={7}>
//                 <Avatar
//                   src={user.picture}
//                   alt={user.nickname}
//                   radius="xl"
//                   size={20}
//                 />
//                 <Text fw={500} size="sm" style={{ lineHeight: 1 }} mr={3}>
//                   {user.nickname}
//                 </Text>
//                 <IconChevronDown size={12} stroke={1.5} />
//               </Group>
//             </UnstyledButton>
//           </Menu.Target>
//           <Menu.Dropdown>
//             <Menu.Item
//               component={Link}
//               to="/profile"
//               rightSection={<IconUser size={14} stroke={1.5} />}
//             >
//               Profiili
//             </Menu.Item>
//             <Menu.Item
//               onClick={() => {
//                 fetcher.submit({}, { action: '/logout', method: 'post' })
//               }}
//               rightSection={<IconLogout size={14} stroke={1.5} />}
//             >
//               Logout
//             </Menu.Item>
//           </Menu.Dropdown>
//         </Menu>
//       </Group>
//       {/*</Header>*/}
//
//       <Drawer
//         opened={drawerOpened}
//         onClose={closeDrawer}
//         size="100%"
//         padding="md"
//         title="Navigaatio"
//         hiddenFrom="sm"
//         zIndex={1_000_000}
//       >
//         <Divider my="sm" color="gray.1" />
//         {navLinks.map(({ id, to, title, testId }) => (
//           <Link
//             key={id}
//             to={to}
//             onClick={closeDrawer}
//             className={cx(classes.link, {
//               [classes.linkActive]: false,
//             })}
//             data-testid={testId}
//           >
//             {title}
//           </Link>
//         ))}
//         <Group grow pb="xl" px="md">
//           <Form action="/logout" method="post">
//             <Button
//               type="submit"
//               leftSection={<IconLogout size={18} />}
//               fullWidth
//             >
//               Kirjaudu ulos
//             </Button>
//           </Form>
//         </Group>
//       </Drawer>
//     </Box>
//   )
// }
