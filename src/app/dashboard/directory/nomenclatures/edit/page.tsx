"use client";
import {Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, ListboxSection, Tooltip} from "@nextui-org/react";
import Link from "next/link";
import { Formik, Form, Field, type FieldProps } from 'formik';
import {Input, Button, Textarea} from "@nextui-org/react";
import { IconTrash } from "@tabler/icons-react";

import { api } from "~/trpc/react";
import * as Yup from 'yup';
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from 'next/navigation';
import LoadingWindow from "~/app/_components/loading";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ImgUploader from "~/app/_components/dashboard/directories/nomenclatures/img-loader";
import { ResponseFileUpload } from "~/app/dashboard/upload-files";

const SignupSchema = Yup.object().shape({
    title: Yup.string()
        .required('Поле «Название товара» является обязательным'),
});

export interface newFile extends File {
    url?: string
}

export type initialValuesInterface = {
    title: string,
    unitId: string|null,

    media: null|(newFile|string)[],
    fileLinks: null|[string],
}

const initialValues: initialValuesInterface = {
    title: '',
    unitId: null,
    media: null,
    fileLinks: null,
};

export default function EditNomenclature() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentDirectoryNomenclatureId, setDirectoryNomenclatureId] = useState<string|null>(null);
    const DirectoryNomenclatureData = api.directoryNomenclature
        .getDirectoryNomenclatureById
        .useQuery(
            currentDirectoryNomenclatureId 
                ? {id: currentDirectoryNomenclatureId} 
                : undefined, 
                { refetchOnWindowFocus: false }
        );

    const directoryUnitsItems = api.directoryUnit.show.useQuery();
    const createUpdateDirectoryNomenclature = api.directoryNomenclature.createUpdateDirectoryNomenclature.useMutation({
        onSuccess: () => {
            toast.success(`Вы успешно сохранили номенклатуру измерения`);

            void router.push('/dashboard/directory/nomenclatures');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if(searchParams.get('id') && currentDirectoryNomenclatureId === null){
            setDirectoryNomenclatureId(searchParams.get('id'));
        }
    },[searchParams])

    return <>
        <Breadcrumbs className="mb-6">
            <BreadcrumbItem><Link shallow={true} href="/dashboard">Главная</Link></BreadcrumbItem>
            <BreadcrumbItem><Link shallow={true} href="/dashboard-panel/directory/nomenclatures">Номенклатура измерений</Link></BreadcrumbItem>
            <BreadcrumbItem>Добавление номеклатуры измерений</BreadcrumbItem>
        </Breadcrumbs>
        <div className="bg-white max-w-3xl mx-auto p-6 rounded-xl shadow-sm relative">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold text-slate-600 mb-8">Добавление номеклатуры измерений</h1>
            </div>
            <div>
                {createUpdateDirectoryNomenclature.isLoading &&
                    <LoadingWindow />
                }
                <Formik
                    initialValues={DirectoryNomenclatureData?.data ?? initialValues}
                    enableReinitialize
                    validationSchema={SignupSchema}
                    onSubmit={async (values) => {
                        let fileLinks: ResponseFileUpload|null = null;
                        const formData = new FormData();

                        console.log(values)

                        if(values?.media){
                            
                            // console.log(values.media);
                            
                            Array.from(values.media).map((file) => {
                                formData.append('files', file);
                            })

                            formData.append('uploadPath', 'images');
                            
                            const res = await fetch('/api/upload-files', {
                                method: 'POST',
                                body: formData
                            })

                            if(res.ok){
                                fileLinks = await res.json() as ResponseFileUpload;
                            }
                        }

                        if(fileLinks && fileLinks !== null){
                            values?.media?.map((item, key: number) => {
                                if(typeof item !== 'string'){
                                    if(values.media !== null){
                                        values.media[key] = fileLinks?.links[0] ?? '';
                                        fileLinks?.links.splice(0, 1);
                                    }
                                }
                            })

                            values.fileLinks = values?.media as [string];
                        }
                        
                        createUpdateDirectoryNomenclature.mutate(values);
                    }}
                    >
                    {({ errors, touched, values, setFieldValue }) => (
                        <Form>
                            <div className="py-6">
                                <Field name="title">
                                    {({field}: {field: React.ComponentType<FieldProps>}) => (
                                        <>
                                            <Input
                                                {...field}
                                                type="text"
                                                label={<span className="mr-2">Название <div className="bg-red-600 rounded-full h-2 w-2 inline-block absolute top-0 right-1"></div></span>}
                                                placeholder="Лист А4"
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
                                        </>
                                    )}
                                </Field>
                                <div className="py-6">
                                    <Field name="width">
                                        {({field}: {field: React.ComponentType<FieldProps>}) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    type="number"
              
                                                    label={<span className="mr-2">Ширина, например, 29.7 <div className="h-2 w-2 inline-block absolute top-0 right-1"></div></span>}
                                                    placeholder="29.7"
                                                    labelPlacement="outside"
                                                    classNames={{
                                                        input: [
                                                            "placeholder:!text-default-700/40",
                                                        ]
                                                    }}
                                                />
                                           </>
                                        )}
                                        
                                    </Field>
                                </div>
                                <div className="py-6">
                                    <Field name="thickness">
                                        {({field}: {field: React.ComponentType<FieldProps>}) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    type="number"
    
                                                    label={<span className="mr-2">глубина, например, 18 <div className="h-2 w-2 inline-block absolute top-0 right-1"></div></span>}
                                                    placeholder="18"
                                                    labelPlacement="outside"
                                                    classNames={{
                                                        input: [
                                                            "placeholder:!text-default-700/40",
                                                        ]
                                                    }}
                                                />
        
                                          </>
                                        )}
                                    </Field>
                                </div>
                                <div className="py-6">

                                
                                <Field name="height">
                                    {({field}: {field: React.ComponentType<FieldProps>}) => (
                                        <>
                                            <Input
                                                {...field}
                                                type="number"

                                                label={<span className="mr-2">высота, например, 0 <div className="h-2 w-2 inline-block absolute top-0 right-1"></div></span>}
                                                placeholder="18"
                                                labelPlacement="outside"
                                                classNames={{
                                                    input: [
                                                        "placeholder:!text-default-700/40",
                                                    ]
                                                }}
                                            />
                                        </>
                                    )}
                                </Field>
                                </div>
                                <label htmlFor="unitId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Выберите единицу измерения</label>
                                <Field
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    title="Выберите единицу измерения"
                                    as="select" 
                                    name="unitId"
                                >
                                    {   
                                        directoryUnitsItems.data?.map((item, index)=>{
                                            return (
                                                <option key={item.id} value={item.id}>{item.title}</option>
                                            )
                                        })
                                    }
                                </Field>

                                
                                {/* Изображения */}
                                <ImgUploader values={values} setFieldValue={setFieldValue} />
                                {/* Изображения */}
    

                            </div>
                            <div>
                                <div className="flex justify-end mt-6">
                                    <Tooltip content={directoryUnitsItems.data? "Единицы измерения найдены" : "Внимание! Перед сохранением номенклатуры обязательно создайте единицу измерения"}>
                                        <Button color="primary" type="submit" variant="shadow" disabled={directoryUnitsItems.data? false : true}>
                                            Сохранить Номенклатуру
                                        </Button>
                                    </Tooltip>
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