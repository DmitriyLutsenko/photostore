'use client';
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/react";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import Link from "next/link";
import {Button} from "@nextui-org/react";
import { api } from "~/trpc/react";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

export default function DirectoryComponentType() {
    const directoryComponentTypeItems = api.directoryComponentType.show.useQuery();
    
    return <>
        <Breadcrumbs className="mb-6">
            <BreadcrumbItem><Link shallow={true} href="/dashboard">Главная</Link></BreadcrumbItem>
            <BreadcrumbItem>Тип компонента единицы измерения</BreadcrumbItem>
        </Breadcrumbs>
        <div className="bg-white max-w-full mx-auto p-6 rounded-xl shadow-sm relative">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold text-slate-600 mb-8">Типы компонента единицы измерения</h1>
                <div>
                    <Link shallow href="/dashboard/directory/component-types/edit">
                        <Button color="primary" variant="shadow" isIconOnly>
                            <IconPlus />
                        </Button>
                    </Link>
                </div>
            </div>
            <div>
                <Table aria-label="Example static collection table">
                    
                    <TableHeader>
                        <TableColumn>Название</TableColumn>
                        <TableColumn>Действия</TableColumn>
                    </TableHeader>
                    
                    <TableBody>
                        {
                            directoryComponentTypeItems?.data?.map((item, key) => <TableRow key={key}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link shallow={true} href={{
                                            pathname: '/dashboard/directory/component-types/edit',
                                            query: { id: item.id },
                                        }}>
                                            <Button isIconOnly variant="shadow" color="success" className="min-w-[30px] h-[30px] w-[30px]">
                                                <IconEdit className="text-white" size={18} />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>) ?? []
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
        <Toaster />
    </>
}