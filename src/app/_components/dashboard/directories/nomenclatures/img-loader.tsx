import SortableList, { SortableItem } from "react-easy-sort";
import {arrayMoveImmutable} from "array-move";
import {Button} from "@nextui-org/react";
import { IconPhotoScan, IconX } from "@tabler/icons-react";
import Image from "next/image";
import {type newFile, type initialValuesInterface} from "~/app/dashboard/directory/nomenclatures/edit/page";
import { type directoryNomenclatureInterface } from "~/server/api/routers/directoryNomenclature";

export default function ImgUploader({values, setFieldValue}: {values:initialValuesInterface|directoryNomenclatureInterface, setFieldValue: (field: string, value: (newFile|string)[]|null, shouldValidate?: (boolean | undefined)) => void}) {

    return <div className="mt-6">
        <hr className="mb-4 border-orange-200" />
        <h3 className="font-medium mb-4">Изображения <span className=" text-slate-400 font-light text-sm">( до 10 штук )</span></h3>
        <div className="flex gap-4">
            <SortableList
                onSortEnd={(oldIndex: number, newIndex: number) => {
                    if(values?.media !== null){
                        void setFieldValue('media', arrayMoveImmutable(values.media, oldIndex, newIndex))
                    }
                }}
                className="flex flex-wrap gap-4"
                draggedItemClassName="dragged"
            > <>

                {values?.media?.map((item: newFile|string, key: number) => {
                    return <SortableItem key={key}>
                            <div className="cursor-grab relative">
                                <Image
                                    draggable="false"
                                    width={128}
                                    height={128}
                                    quality={50}
                                    alt="Предзагрузка изображений"
                                    className="rounded-xl overflow-hidden object-cover h-32"
                                    src={typeof item !== 'string' ? item.url! : item}
                                />
                                <Button onClick={() => {
                                    if(values?.media){
                                        values?.media?.splice(key, 1);
                                        void setFieldValue('media', values?.media.length > 0 ? values.media : null);
                                    }
                                }} isIconOnly color="danger" variant="shadow" className="rounded-full h-5 w-5 min-w-5 absolute -top-2 -right-2" >
                                    <IconX className="w-5 h-5" />
                                </Button>
                            </div>
                        </SortableItem>
                    })
                }
                <div className="relative">
                    <Button isIconOnly color="primary" variant="bordered" className="w-32 h-32">
                        <input
                            name="media"
                            onChange={(e) => {
                                if(e.currentTarget.files !== null){
                                    const media = values.media !== null ? [...values.media, ...e.currentTarget.files] : e.currentTarget.files;

                                    Array.from(media).map((item: newFile|string) => {
                                        if(typeof item !== 'string' && item.size){
                                            item.url = URL.createObjectURL(item);
                                        }
                                    });

                                    void setFieldValue('media', Array.from(media))
                                }
                            }}
                            type="file"
                            multiple 
                            accept="image/png, image/jpeg, image/webp"
                            className="absolute w-32 h-32 opacity-0 cursor-pointer"
                        />
                            <IconPhotoScan size={50} />
                    </Button>
                </div>
            </>
            </SortableList>
        </div>
    </div>
}