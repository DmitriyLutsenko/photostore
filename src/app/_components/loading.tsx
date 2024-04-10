import {Spinner} from "@nextui-org/react";
import { motion } from "framer-motion";

export default function LoadingWindow() {
    return <>
        <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }} 
            className={"z-30 flex justify-center items-center absolute w-full h-full top-0 left-0 backdrop-blur-sm bg-white/75 rounded-xl"}>
                <Spinner size="lg" />
        </motion.div>
    </>
}