import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const DataCards = ({
    data = [],
    fields = [],
    titleKey = "name",
    loading = false,
    emptyMessage = "No data found",
    onEdit,
    onDelete,
    extraContent,
}) => {

    // Skeleton Loader
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 dark:gap-10">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-48 rounded-2xl border
                        bg-gray-100 dark:bg-gray-800
                        border-gray-200 dark:border-gray-700
                        animate-pulse"
                    />
                ))}
            </div>
        );
    }

    // Empty State
    if (!data.length) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 rounded-3xl border-2 border-dashed
                bg-gray-50 dark:bg-gray-800
                border-gray-200 dark:border-gray-700"
            >
                <div className="text-2xl mb-2">📭</div>
                <p className="font-medium text-gray-500 dark:text-gray-400">
                    {emptyMessage}
                </p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 dark:gap-10">
            <AnimatePresence>
                {data.map((item, index) => (
                    <motion.div
                        key={item.id || index}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="group relative rounded-2xl
                        p-6 dark:p-8
                        shadow-sm transition-all duration-300
                        bg-white dark:bg-gray-900
                        border border-gray-100 dark:border-gray-700
                        hover:shadow-xl
                        hover:border-indigo-100 dark:hover:border-indigo-500"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold tracking-tight transition-colors
                                text-gray-900 dark:text-gray-100
                                group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {item[titleKey]}
                            </h3>

                            <div className="h-2 w-2 rounded-full bg-indigo-400 group-hover:scale-150 transition-transform" />
                        </div>

                        {/* Dynamic Fields */}
                        <div className="space-y-3">
                            {fields.map((field) => (
                                <div key={field.key} className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-wider font-bold
                                        text-gray-400 dark:text-gray-500">
                                        {field.label}
                                    </span>
                                    <div className="text-sm font-medium
                                        text-gray-700 dark:text-gray-300">
                                        {field.render
                                            ? field.render(item[field.key], item)
                                            : item[field.key] ?? (
                                                <span className="text-gray-300 dark:text-gray-600">
                                                    N/A
                                                </span>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Extra Content */}
                        {extraContent && (
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                {extraContent(item)}
                            </div>
                        )}

                        {/* Action Buttons */}
                        {(onEdit || onDelete) && (
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t
                                border-gray-100 dark:border-gray-700
                                opacity-0 group-hover:opacity-100 transition-opacity">

                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="flex items-center justify-center h-9 w-9 rounded-xl shadow-sm transition-all duration-200
                                        bg-indigo-50 dark:bg-gray-800
                                        text-indigo-600 dark:text-indigo-400
                                        hover:bg-indigo-600 hover:text-white"
                                        title="Edit"
                                    >
                                        <PencilSquareIcon className="h-4 w-4" />
                                    </button>
                                )}

                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="flex items-center justify-center h-9 w-9 rounded-xl shadow-sm transition-all duration-200
                                        bg-red-50 dark:bg-gray-800
                                        text-red-600 dark:text-red-400
                                        hover:bg-red-600 hover:text-white"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default DataCards;
