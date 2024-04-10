'use client'

import Image from 'next/image';
import {
    IconShoppingBag,
    IconRulerMeasure,
    IconListLetters,
    IconComponents,
    IconUserBolt,
    IconUsersGroup
} from '@tabler/icons-react';

import {Accordion, AccordionItem} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Aside() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    return <>
        <div id="aside-menu" className={`animate-fade-right animate-duration-500 hidden w-[500px] lg:w-[500px] h-screen lg:block overflow-y-auto pb-12 fixed bg-white z-50 shadow-lg lg:relative lg:shadow-none lg:left-0`}>
            <div className="bg-white sticky top-0 pb-4 lg:pt-6 pt-16">
                <Image
                    src={`/dark-logo.svg`}
                    width={120}
                    height={70}
                    objectFit="contain"
                    alt="Picture of the author"
                    className="mx-auto"
                />
            </div>

            <aside className="px-6 mt-12">
                <div>
                    <h3 className="uppercase text-sm font-medium px-4">Товары</h3>
                    <ul className="mt-3">
                        <Link shallow={true} href="/dashboard/products">
                            <li className={`${((pathname === '/dashboard/products') && "bg-blue-500 mt-1 !text-white hover:!bg-blue-500")} truncate flex items-center font-light gap-x-2 text-slate-500 hover:bg-blue-100/50 px-4 py-[13px] rounded-xl hover:text-blue-400 cursor-pointer transition-all duration-500`}>
                                <IconShoppingBag size={20.8} />Товары
                            </li>
                        </Link>
                    </ul>
                </div>

                <div className="mt-8">
                    <h3 className="uppercase text-sm font-medium px-4">Справочники</h3>

                    <nav className="mt-3">
                        <Accordion isCompact>
                            <AccordionItem key="1" aria-label="Измерение" title="Измерение">
                                <Link shallow={true} href="/dashboard/directory/units">
                                    <div className={`${(pathname === '/dashboard/directory/units' && "bg-red-500 !text-white hover:!bg-red-500")} truncate flex items-center font-light gap-x-2 text-slate-500 hover:bg-blue-100/50 px-4 py-[13px] rounded-xl hover:text-blue-400 cursor-pointer transition-all duration-500`}>
                                        <IconRulerMeasure size={20.8} />Единицы Измерения
                                    </div>
                                </Link>
                          
                                <Link shallow={true} href="/dashboard/directory/nomenclatures">
                                    <div className={`${(pathname === '/dashboard/directory/nomenclatures' && "bg-red-500  !text-white hover:!bg-red-500")} truncate mt-1 flex items-center font-light gap-x-2 text-slate-500 hover:bg-blue-100/50 px-4 py-[13px] rounded-xl hover:text-blue-400 cursor-pointer transition-all duration-500`}>
                                        <IconListLetters size={20.8} />Номенклатура ед. изм.
                                    </div>
                                </Link>

                                <Link shallow={true} href="/dashboard/directory/component-types">
                                    <div className={(pathname === '/dashboard/directory/component-types' && "bg-red-500  !text-white hover:!bg-red-500") + " mt-1 truncate flex items-center font-light gap-x-2 text-slate-500 hover:bg-blue-100/50 px-4 py-[13px] rounded-xl hover:text-blue-400 cursor-pointer transition-all duration-500"}>
                                        <IconComponents size={20.8} />Тип компонентов измерений
                                    </div>
                                </Link>
                            </AccordionItem>
                        </Accordion>
                    </nav>

                    <nav className="mt-3">
                        <Accordion isCompact>
                            <AccordionItem key="1" aria-label="Компоненты" title="Компоненты">
                                <Link shallow={true} href="/dashboard/components">
                                    <div className={`${(pathname === '/dashboard/components' && "bg-orange-500 !text-white hover:!bg-orange-500")} truncate flex items-center font-light gap-x-2 text-slate-500 hover:bg-blue-100/50 px-4 py-[13px] rounded-xl hover:text-blue-400 cursor-pointer transition-all duration-500`}>
                                        <IconComponents size={20.8} />Компоненты
                                    </div>
                                </Link>
                          
                                <Link shallow={true} href="/dashboard/components/nomenclature">
                                    <div className={`${(pathname === '/dashboard/components/nomenclature' && "bg-orange-500  !text-white hover:!bg-orange-500")} truncate mt-1 flex items-center font-light gap-x-2 text-slate-500 hover:bg-blue-100/50 px-4 py-[13px] rounded-xl hover:text-blue-400 cursor-pointer transition-all duration-500`}>
                                        <IconListLetters size={20.8} />Номенклатура компонентов
                                    </div>
                                </Link>
                            </AccordionItem>
                        </Accordion>
                    </nav>

                    <nav className="mt-3">
                        <Accordion isCompact>
                            <AccordionItem key="1" aria-label="Поставщики" title="Поставщики">

                                <Link shallow={true} href="/dashboard/suppliers/users">
                                    <div className={`${(pathname === '/dashboard/suppliers/users' && "bg-violet-500 !text-white hover:!bg-violet-500")} truncate flex items-center font-light gap-x-2 text-slate-500 hover:bg-blue-100/50 px-4 py-[13px] rounded-xl hover:text-blue-400 cursor-pointer transition-all duration-500`}>
                                        <IconUserBolt size={20.8} />Пользователи
                                    </div>
                                </Link>

                                <Link shallow={true} href="/dashboard/suppliers/details">
                                    <div className={`${(pathname === '/dashboard/suppliers/details' && "bg-violet-500 !text-white hover:!bg-violet-500")} truncate flex items-center font-light gap-x-2 text-slate-500 hover:bg-blue-100/50 px-4 py-[13px] rounded-xl hover:text-blue-400 cursor-pointer transition-all duration-500`}>
                                        <IconUserBolt size={20.8} />Профили поставщика
                                    </div>
                                </Link>
                          
                                <Link shallow={true} href="/dashboard/suppliers/nomenclature">
                                    <div className={`${(pathname === '/dashboard/suppliers/nomenclature' && "bg-violet-500  !text-white hover:!bg-violet-500")} truncate mt-1 flex items-center font-light gap-x-2 text-slate-500 hover:bg-blue-100/50 px-4 py-[13px] rounded-xl hover:text-blue-400 cursor-pointer transition-all duration-500`}>
                                        <IconUsersGroup size={20.8} />Номенклатура поставщика
                                    </div>
                                </Link>
                            </AccordionItem>
                        </Accordion>
                    </nav>

                    
                </div>
            </aside>
        </div>
    </>

}