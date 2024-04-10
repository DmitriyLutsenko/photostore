import { Avatar, Badge, Button } from "@nextui-org/react";
import { IconMenu2, IconShoppingCart } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";


export default function Navbar() {
    const router = useRouter();
    const [openAsideMenu, setOpenAsideMenu] = useState<boolean>(false);
    // const tg = api.telegram.get.useQuery();

    useEffect(() => {
        if (openAsideMenu) {
            document.getElementById('aside-menu')?.classList.remove('hidden');
        } else {
            document.getElementById('aside-menu')?.classList.add('hidden');
        }
    }, [openAsideMenu]);

    useEffect(() => {
        setOpenAsideMenu(false);
    }, [router])

    return <>
        <div onClick={() => { void setOpenAsideMenu(!openAsideMenu) }} className={(openAsideMenu ? "" : "hidden ") + "animate-fade animate-duration-500 w-full h-full fixed top-0 left-0 z-40 bg-white/70 backdrop-blur-sm"}></div>
        <div className="bg-white h-[64px] flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
                <Button onPress={() => { void setOpenAsideMenu(!openAsideMenu) }} isIconOnly variant="ghost" className="border-none lg:hidden z-50">
                    <IconMenu2 />
                </Button>
            </div>
            <div className="flex gap-4 items-center">
                <Avatar src="/user-1.jpg" />
            </div>
        </div>
    </>
}