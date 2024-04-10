'use client';
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { api } from "~/trpc/react";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { Toaster } from "react-hot-toast";

export default function Users() {
    const users = api.user.show.useQuery();

    return <>
        <Breadcrumbs className="mb-6">
            <BreadcrumbItem><Link shallow={true} href="/dashboard/">Главная</Link></BreadcrumbItem>
            <BreadcrumbItem>Пользователи</BreadcrumbItem>
        </Breadcrumbs>
        <div className="bg-white max-w-full mx-auto p-6 rounded-xl shadow-sm relative">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold text-slate-600 mb-8">Пользователи</h1>
                <div>
                    <Button color="primary" variant="shadow" isIconOnly>
                        <Link shallow href="/dashboard/suppliers/users/edit"><IconPlus /></Link>
                    </Button>
                </div>
            </div>
            <div>
                <Table aria-label="Example static collection table">
                    
                    <TableHeader>
                        <TableColumn>Имя</TableColumn>
                        <TableColumn>Почта</TableColumn>
                        <TableColumn>Уровень</TableColumn>
                        <TableColumn>Дата создания</TableColumn>
                        <TableColumn>Действия</TableColumn>
                    </TableHeader>

                    <TableBody>
                        {
                            users?.data?.map((item, key) => (
                                <TableRow key={key}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.email}</TableCell>
                                  <TableCell>{item.level}</TableCell>
                                  <TableCell>{item.createdAt.toDateString()}</TableCell>

                                  <TableCell>
                                    <div className="flex gap-2">
                                        <Link shallow={true} href={{
                                            pathname: '/dashboard/suppliers/users/edit',
                                            query: { id: item.id },
                                        }}>
                                            <Button isIconOnly variant="shadow" color="success" className="min-w-[30px] h-[30px] w-[30px]">
                                                <IconEdit className="text-white" size={18} />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>)) ?? []
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
        <Toaster />
    </>
}