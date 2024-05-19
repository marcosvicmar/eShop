import { Divider, Stack, Link, Avatar, MenuButton, Menu, MenuList, MenuItem, Spacer, IconButton } from "@chakra-ui/react";
import NextLink from 'next/link'
import styles from './ShopSkeleton.module.css';
import { useSession } from "@/providers/session.provider";
import { useRouter } from "next/router";
import { BsCartFill } from "react-icons/bs";

interface SkeletonProps {
    children?: React.ReactNode;
}

export const ShopSkeleton: React.FC<SkeletonProps> = ({ children }) => {
    const { logout } = useSession();
    const { push } = useRouter();

    return (
        <div style={{ flex: 1 }}>
            <header className={styles["header_skeleton"]}>
                <Stack direction='row'>
                    <Link as={NextLink} href="/">Shop Commerce</Link>
                    <Spacer />
                    <Stack direction='row'>
                        <Link as={NextLink} href="/">Home</Link>
                        <Divider orientation="vertical"></Divider>
                        <Link as={NextLink} href="/products">Products</Link>
                        <Divider orientation="vertical"></Divider>
                        <Link as={NextLink} href="/categories">Categories</Link>
                        <Divider orientation="vertical"></Divider>
                        <Link as={NextLink} href="/orders/2">About Us</Link>
                    </Stack>
                    <Spacer />
                    <IconButton 
                        aria-label="Cart" 
                        icon={<BsCartFill />} 
                        height={"1.25em"} 
                        onClick={() => push('/carts')}
                    />
                    <Menu>
                        {({ isOpen }) => (
                            <>
                                <MenuButton as={Avatar} width={"1.25em"} height={"1.25em"} />
                                <MenuList>
                                    <MenuItem onClick={() => push('/orders')}>Orders</MenuItem>
                                    <MenuItem onClick={logout}>Sign Out</MenuItem>
                                </MenuList>
                            </>
                        )}
                    </Menu>
                </Stack>
            </header>
            <main className={styles["main_skeleton"]}>
                {children}
            </main>
            <footer className={styles["footer_skeleton"]}>
                <div className={styles["information_skeleton"]}>
                    <Stack justifyContent='center' spacing={128} direction='row'>
                        <section>
                            <h4>Phone Call Number</h4>
                            <small>
                                Call to <strong>+1 234 567 890</strong> to get support or something else.
                            </small>
                        </section>
                        <section>
                            <h4>Data Privacy Contact</h4>
                            <small>
                                Email to <strong>dataprivacy@example.com</strong> to get support or something else.
                            </small>
                        </section>
                    </Stack>
                </div>
                <div className={styles["copyright_skeleton"]}>
                    <Stack justifyContent='left' spacing={128} direction='row'>
                        <Link>Copyright &copy; Shop Commerce Authors {(new Date()).getFullYear()}  </Link>
                    </Stack>
                </div>

            </footer>
        </div>
    );
}