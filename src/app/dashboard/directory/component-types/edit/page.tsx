'use client';
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import Link from "next/link";
import { Formik, Form, Field, type FieldProps } from 'formik';
import {Input, Button, Textarea} from "@nextui-org/react";
import { api } from "~/trpc/react";
import * as Yup from 'yup';
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from 'next/navigation';
import LoadingWindow from "~/app/_components/loading";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SignupSchema = Yup.object().shape({
    title: Yup.string()
        .required('Поле «Название типа компонента единицы измерения является обязательным'),
});


export interface initialValuesInterface {
    title: string,
}

const initialValues: initialValuesInterface = {
    title: '',
};

export default function EditDirectoryComponentType() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [currentDirectoryComponentTypeId, setCurrentDirectoryComponentTypeId] = useState<string|null>(null); 
    const directoryComponentTypeData = api.directoryComponentType.getDirectoryComponentTypeById.useQuery(currentDirectoryComponentTypeId ? {id: currentDirectoryComponentTypeId} : undefined, { refetchOnWindowFocus: false });
    const createUpdateDirectoryComponentType = api.directoryComponentType.createUpdateDirectoryComponentType.useMutation({
        onSuccess: () => {
            toast.success(`Вы успешно сохранили тип компонента единицы измерения`);

            void router.push('/dashboard/directory/component-types');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if(searchParams.get('id') && currentDirectoryComponentTypeId === null){
            setCurrentDirectoryComponentTypeId(searchParams.get('id'));
            console.log(currentDirectoryComponentTypeId);
        }
    },[searchParams])

    return <>
        <Breadcrumbs className="mb-6">
            <BreadcrumbItem><Link shallow={true} href="/dashboad">Главная</Link></BreadcrumbItem>
            <BreadcrumbItem><Link shallow={true} href="/dashboard/directory/component-types">Тип компонента единицы измерения</Link></BreadcrumbItem>
            <BreadcrumbItem>{currentDirectoryComponentTypeId? "Редактирование" : "Добавление"}</BreadcrumbItem>
        </Breadcrumbs>
        <div className="bg-white max-w-3xl mx-auto p-6 rounded-xl shadow-sm relative">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold text-slate-600 mb-8">
                    {currentDirectoryComponentTypeId? "Редактирование" : "Добавление"}</h1>
            </div>
            <div>
                {createUpdateDirectoryComponentType.isLoading &&
                    <LoadingWindow />
                }
                <Formik
                    initialValues={directoryComponentTypeData?.data ?? initialValues}
                    enableReinitialize
                    validationSchema={SignupSchema}
                    onSubmit={async (values) => {

                        createUpdateDirectoryComponentType.mutate(values);
                    }}
                    >
                    {({ errors, touched}) => (
                        <Form>
                            <div className="py-6">
                                <Field name="title">
                                    {({field}: {field: React.ComponentType<FieldProps>}) => (
                                        <div>
                                            <Input
                                                {...field}
                                                type="text"
                                                label={<span className="mr-2">Название <div className="bg-red-600 rounded-full h-2 w-2 inline-block absolute top-0 right-1"></div></span>}
                                                placeholder="Название"
                                                labelPlacement="outside"
                                                classNames={{
                                                    input: [
                                                        "placeholder:!text-default-700/40",
                                                    ]
                                                }}
                                            />
                                            {errors.title && touched.title ? (
                                                <div className='text-red-600 text-sm mt-2'>{errors.title}</div>
                                            ) : null}
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div>
                                <div className="flex justify-end mt-6">
                                    <Button color="primary" type="submit" variant="shadow">
                                    {currentDirectoryComponentTypeId? "Обновить" : "Создать"}
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

function setCurrentDirectoryComponentTypeId(arg0: string | null) {
    throw new Error("Function not implemented.");
}
