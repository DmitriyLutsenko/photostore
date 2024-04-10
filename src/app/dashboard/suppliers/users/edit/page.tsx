'use client';
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import Link from "next/link";
import { Formik, Form, Field, type FieldProps } from 'formik';
import {Input, Button} from "@nextui-org/react";
import { api } from "~/trpc/react";
import * as Yup from 'yup';
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from 'next/navigation';
import LoadingWindow from "~/app/_components/loading";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SupplierList from "~/app/_components/dashboard/directories/suppliers/list";
import { newFile } from "~/server/api/routers/products";
import { supplierDetailInterface } from "~/server/api/routers/supplierDetails";

const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .required('Поле Имя является обязательным'),
    password: Yup.string()
        .required('Поле Пароль является обязательным'),
    email: Yup.string()
        .required('Поле Почта является обязательным'),
});


export interface initialValuesInterface {
    id: string|undefined,
    name: string,
    email: string,
    image: string|undefined,
    level: number,
    password: string,
}

const initialValues: initialValuesInterface = {
    name: "",
    email: "",
    level: 10,
    password: "",
    id: undefined,
    image: undefined
};

export default function EditUser() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentUserId, setCurrentUserId] = useState<string|null>(null);
    const userData = api.user.getUserById.useQuery(currentUserId ? {id: currentUserId} : undefined, { refetchOnWindowFocus: false });
    const supplierData = api.suppliers.showSuppliersByUserId.useQuery(currentUserId ? {id: currentUserId} : undefined, { refetchOnWindowFocus: false });
    const createUpdateUser = api.user.createUpdateUser.useMutation({
        onSuccess: () => {
            toast.success(`Данные пользователя успешно обновлены`);

            void router.push('/dashboard/suppliers/users');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if(searchParams.get('id') && currentUserId === null){
            setCurrentUserId(searchParams.get('id'));
            console.log(currentUserId);
        }
    },[searchParams])

    return <>
        <Breadcrumbs className="mb-6">
            <BreadcrumbItem><Link shallow={true} href="/dashboad">Главная</Link></BreadcrumbItem>
            <BreadcrumbItem><Link shallow={true} href="/dashboard/suppliers/users">Пользователи</Link></BreadcrumbItem>
            <BreadcrumbItem>{currentUserId? "Редактирование" : "Добавление"}</BreadcrumbItem>
        </Breadcrumbs>
        <div className="bg-white max-w-3xl mx-auto p-6 rounded-xl shadow-sm relative">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold text-slate-600 mb-8">
                    {currentUserId? "Редактирование" : "Добавление"}</h1>
            </div>
            <div>
                {createUpdateUser.isLoading &&
                    <LoadingWindow />
                }
                <Formik
                    initialValues={userData?.data ?? initialValues}
                    enableReinitialize
                    validationSchema={SignupSchema}
                    onSubmit={async (values) => {
                        //values.supplierDetails = JSON.stringify(values.supplierDetails);
                        //How fix this error?
                        createUpdateUser.mutate(values);
                    }}
                    >
                    {({ errors, values, touched}) => (
                        <Form>
                            <div className="py-4">
                                <Field name="name">
                                    {({field}: {field: React.ComponentType<FieldProps>}) => (
                                        <div>
                                            <Input
                                                {...field}
                                                type="text"
                                                label={<span className="mr-2">Имя <div className="bg-red-600 rounded-full h-2 w-2 inline-block absolute top-0 right-1"></div></span>}
                                                placeholder="Например, Юрий Алексеевич Гагарин"
                                                labelPlacement="outside"
                                                classNames={{
                                                    input: [
                                                        "placeholder:!text-default-700/40",
                                                    ]
                                                }}
                                            />
                                            {errors.name && touched.name ? (
                                                <div className='text-red-600 text-sm mt-2'>{errors.name}</div>
                                            ) : null}
                                        </div>
                                    )}
                                </Field>
                            </div>

                            <div className="py-4">
                                <Field name="password">
                                    {({field}: {field: React.ComponentType<FieldProps>}) => (
                                        <div>
                                            <Input
                                                {...field}
                                                type="password"
                                                label={<span className="mr-2">Пароль <div className="bg-red-600 rounded-full h-2 w-2 inline-block absolute top-0 right-1"></div></span>}
                                                placeholder="Введите пароль"
                                                labelPlacement="outside"
                                                classNames={{
                                                    input: [
                                                        "placeholder:!text-default-700/40",
                                                    ]
                                                }}
                                            />
                                            {errors.password && touched.password ? (
                                                <div className='text-red-600 text-sm mt-2'>{errors.password}</div>
                                            ) : null}
                                        </div>
                                    )}
                                </Field>
                            </div>

                            <div className="py-4">
                                <Field name="email">
                                    {({field}: {field: React.ComponentType<FieldProps>}) => (
                                        <div>
                                            <Input
                                                {...field}
                                                type="email"
                                                label={<span className="mr-2">Почта <div className="bg-red-600 rounded-full h-2 w-2 inline-block absolute top-0 right-1"></div></span>}
                                                placeholder="Введите почту, например photostory@gmail.com"
                                                labelPlacement="outside"
                                                classNames={{
                                                    input: [
                                                        "placeholder:!text-default-700/40",
                                                    ]
                                                }}
                                            />
                                            {errors.email && touched.email ? (
                                                <div className='text-red-600 text-sm mt-2'>{errors.email}</div>
                                            ) : null}
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className="py-4">
                                <Field name="level">
                                    {({field}: {field: React.ComponentType<FieldProps>}) => (
                                        <div>
                                            <Input
                                                {...field}
                                                type="number"
                                                label={<span className="mr-2">Уровень</span>}
                                                placeholder="Введите уровень, например, 10"
                                                labelPlacement="outside"
                                                classNames={{
                                                    input: [
                                                        "placeholder:!text-default-700/40",
                                                    ]
                                                }}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </div>

                            <div className="mt-6">
                                    
                                    

                            </div>

                            <div className="mt-6">
                                
                                <SupplierList values={supplierData.data as supplierDetailInterface[] | null} />
                            
                            </div>


                            <div className="py-4">
                                <div className="flex justify-end mt-6">
                                    <Button color="primary" type="submit" variant="shadow">
                                    {currentUserId? "Обновить" : "Создать"}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="text-slate-400 text-sm mt-4">
                    <div className="bg-red-600 rounded-full h-2 w-2 inline-block mr-2" /> обязательное поле
                </div>
            </div>
        </div>
        <Toaster />
    </>
}
