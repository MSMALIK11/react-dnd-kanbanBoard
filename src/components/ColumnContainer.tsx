import { useMemo, useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../components/icons/TrashIcon";
import { CSS } from "@dnd-kit/utilities";
import { Column, Id, Task } from "../types/types";
import TaskCard from "./TaskCard";
import Each from "./shared/Each";
import PlusIcon from "./icons/PlusIcon";

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;

    createTask: (columnId: Id) => void;
    updateTask: (id: Id, content: string) => void;
    deleteTask: (id: Id) => void;
    tasks: Task[];
}
function ColumnContainer({
    column,
    tasks,
    updateColumn,
    deleteColumn,
    deleteTask,
    updateTask,
    createTask,
}: Props) {
    const [editMode, setEditMode] = useState(false);
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        dark:bg-secondary
        bg-white
        w-[350px]
        h-[480px]
        max-h-[480px]
        rounded-md
        flex
        flex-col
        shadow-md
        `}
        >
            <div
                {...attributes}
                {...listeners}
                className="
    dark:text-textPrimary
      dark:bg-primary
      bg-bgColumnSecondary
      text-textSecondary
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      dark:border-secondary
      border:text-gray-400
      border-4
      flex
      items-center
      justify-between
      "
            >
                <div
                    onDoubleClick={() => {
                        setEditMode(true);
                    }}
                    title="Double click to edit the column title"
                >
                    {!editMode && column.title}<span className="bg-blue-400 rounded-full inline-flex w-6 items-center justify-center ms-4">  {tasks?.length}</span>
                </div>
                {editMode && (
                    <input
                        className="dark:bg-black bg-white  focus:border-rose-500 border rounded outline-none px-2"
                        onChange={(e) => updateColumn(column.id, e.target.value)}
                        autoFocus
                        onBlur={() => {
                            setEditMode(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return;
                            setEditMode(false);
                        }}
                    />
                )}
                <button
                    onClick={() => {
                        deleteColumn(column.id);
                    }}
                    className="
        stroke-gray-500
        hover:stroke-white
        hover:secondary
        rounded
        px-1
        py-2
        "
                >
                    <TrashIcon />
                </button>
            </div>
            {/* Column task container */}
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksIds}>
                    <Each
                        of={tasks}
                        render={(item, index) => (
                            <TaskCard
                                task={item}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                indexId={index}
                            />
                        )}
                    />
                </SortableContext>
            </div>

            {/* Column footer */}
            <button
                className="flex text-gray-900 dark:text-white gap-2 items-center dark:border-secondary border-gray-400 border-2 rounded-md p-4 dark:border-x-secondary border-x-gray-400 dark:hover:bg-primary  dark:hover:text-rose-500 hover:text-rose-500 dark:active:bg-black active:bg-gray-200"
                onClick={() => {
                    createTask(column.id);
                }}
            >
                <PlusIcon />
                Add task
            </button>
        </div>
    );
}

export default ColumnContainer;
