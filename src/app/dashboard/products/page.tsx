"use client";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/react";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import Link from "next/link";
import {Button} from "@nextui-org/react";
import { api } from "~/trpc/react";
import { IconEdit, IconLock, IconLockOpen } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

export default function Products() {
    const products = api.product.getProducts.useQuery();

    return <>
        <Breadcrumbs className="mb-6">
            <BreadcrumbItem><Link shallow={true} href="/dashboard">Главная</Link></BreadcrumbItem>
            <BreadcrumbItem>Товары</BreadcrumbItem>
        </Breadcrumbs>
        <div className="bg-white max-w-full mx-auto p-6 rounded-xl shadow-sm relative">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold text-slate-600 mb-8">Товары</h1>
                <div>
                    <Button color="primary" variant="shadow">
                        <Link shallow href="/admin-panel/products/edit">Создать товар</Link>
                    </Button>
                </div>
            </div>
            <div>
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>ID</TableColumn>
                        <TableColumn>Название</TableColumn>
                        <TableColumn>Описание</TableColumn>
                        <TableColumn>Ширина</TableColumn>
                        <TableColumn>Глубина</TableColumn>
                        <TableColumn>Высота</TableColumn>
                        <TableColumn>Действия</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {
                            products?.data?.map((item, key) => <TableRow key={key}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item?.width}</TableCell>
                                <TableCell>{item?.thickness}</TableCell>
                                <TableCell>{item?.height}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link shallow={true} href={{
                                            pathname: '/dashboard/products/edit',
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