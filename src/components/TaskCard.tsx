import { useState } from 'react'
import { Id, Task } from '../types/types';
import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from '../components/icons/TrashIcon'
import { CSS } from "@dnd-kit/utilities";
import TimeIcon from './icons/TimeIcon';
interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
    indexId: Id

}

const colors = ["#FF3EA5", "#1D24CA", "#FDBF60", "#FF004D", "#F6F7C4"]
const getColor = (index: number): string => {
    const colorIndex = index % 5;
    return colors[colorIndex];
};
function TaskCard({ task, deleteTask, updateTask, indexId }: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(true);
    console.log(updateTask)
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        borderLeft: `2px solid ${getColor(Number(indexId))}`
    };

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="
          opacity-30
        bg-primary p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
        "
            />
        );
    }

    if (editMode) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="dark:bg-primary bg-gray-200 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
            >
                <textarea

                    className="
          h-[90%]
          w-full resize-none border-none rounded bg-transparent text-primary dark:text-white focus:outline-none
          "
                    value={task.content}
                    autoFocus
                    placeholder="Task content here"
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                            toggleEditMode();
                        }
                    }}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                />
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={toggleEditMode}
            className="dark:bg-primary w-full dark:text-priamry bg-white shadow-lg  text-gray-900  p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500  cursor-grab relative task"
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
        >
            <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-primary dark:text-white">
                {task.content}
            </p>

            {mouseIsOver && (
                <button
                    onClick={() => {
                        deleteTask(task.id);
                    }}
                    className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 dark:bg-secondary bg-white p-2 rounded opacity-60 hover:opacity-100"
                >
                    <TrashIcon />
                </button>
            )}

            <div className='absolute bottom-1 right-2 flex gap-2 text-sm items-center'>
                <TimeIcon />
                <span className='text-gray-500'>{task?.date}</span>
            </div>

        </div>
    );
}

export default TaskCard;