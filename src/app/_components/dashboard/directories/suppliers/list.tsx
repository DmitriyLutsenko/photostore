import {Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { type supplierDetailInterface } from "~/server/api/routers/supplierDetails";

export default function SupplierList({values}:{values:supplierDetailInterface[]|null}) {
    return (
        <div className="mt-6">

            <hr className="mb-4 border-orange-200" />
            <h3 className="font-medium mb-4">Профили поставщика</h3>
            <div>
                    <Link shallow href="/dashboard/suppliers/details/edit">
                        <Button color="primary" variant="shadow" isIconOnly>
                            <IconPlus/>
                        </Button>
                    </Link>
                </div>
            <div className="flex gap-4">
            <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Наименование организации</TableColumn>
                        <TableColumn>Почта организации</TableColumn>
                        <TableColumn>Действия</TableColumn>
                    </TableHeader>

                    <TableBody>
                        {
                            values?.map((item, key) => (
                                <TableRow key={key}>
                                  <TableCell>{item.organization}</TableCell>
                                  <TableCell>{item.email}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                        <Link shallow={true} href={{
                                            pathname: '/dashboard/suppliers/details/edit',
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
    )
}