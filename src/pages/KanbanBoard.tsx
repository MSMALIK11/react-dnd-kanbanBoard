import { useState, useMemo, useEffect } from "react";
import { Column, Id, Task } from "../types/types";
import Header from "../components/Header";
import ColumnContainer from "../components/ColumnContainer";
import Each from "../components/shared/Each";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "../components/TaskCard";
import { getCurrentDate } from '../helper/getCurrentDate'
import { Navigate } from "react-router-dom";
function generateId() {
    /* Generate a random number between 0 and 10000 */
    return Math.floor(Math.random() * 10001);
}
const KanbanBoard = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const userName: string | null = JSON.parse(localStorage.getItem('kanbanAdmin') || 'null');
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    if (!userName) return <Navigate to="/" replace />
    const createNewColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        };

        setColumns([...columns, columnToAdd]);
    };
    // Update Column Title
    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map((col) => {
            if (col.id !== id) return col;
            return { ...col, title };
        });

        setColumns(newColumns);
    }
    // Delete columns
    const deleteColumn = (id: Id) => {
        const filterdColumn = columns.filter((columns) => columns.id !== id);
        setColumns(filterdColumn);
    };
    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    };
    // OnDrag end
    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;

        console.log("DRAG END");

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

            const overColumnIndex = columns.findIndex((col) => col.id === overId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
                    // Fix introduced after video recording
                    tasks[activeIndex].columnId = tasks[overIndex].columnId;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);

                tasks[activeIndex].columnId = overId;
                console.log("DROPPING TASK OVER COLUMN", { activeIndex });
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }
    // Create Task inside column
    const createTask = (columnId: Id) => {

        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
            date: getCurrentDate()
        };

        setTasks([...tasks, newTask]);
    };
    const deleteTask = (id: Id) => {
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
    };

    const updateTask = (id: Id, content: string) => {
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task;
            return { ...task, content };
        });

        setTasks(newTasks);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );
    const handleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
    }
    interface DataType {
        columns: Column[];
        tasks: Task[];
    }

    const storedDataString: string | null = localStorage.getItem('kanbanBoard');
    const data: DataType = storedDataString ? JSON.parse(storedDataString) : { columns: [], tasks: [] };
    useEffect(() => {
        if (data) {
            // Assuming that the data object has properties columns and tasks
            setColumns(data.columns || []);
            setTasks(data.tasks || []);
        }
    }, []);

    useEffect(() => {
        const payload = {
            columns,
            tasks,
        };
        const payloadData = JSON.stringify(payload);
        localStorage.setItem('kanbanBoard', payloadData);
    }, [tasks, columns]);
    useEffect(() => {
        // Add or remove the 'dark' class based on the isDarkMode state
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }

        // Clean up the effect
        return () => {
            document.body.classList.remove('dark');
        };
    }, [isDarkMode]);




    return (
        <div id="kanban-board" className={`dark:bg-primary ${isDarkMode && 'dark transition-all'}`}>
            <Header handleDarkMode={handleDarkMode} createNewColumn={createNewColumn} />
            <div
                className="mt-4
          flex
          min-h-screen
          w-full
          overflow-x-auto
          overflow-y-hidden
          lg:px-[40px]
          sm:px-2
        dark:bg-primary
        bg-gray-100

      "
            >
                <DndContext
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                >
                    <div className="flex gap-2 " id="column-container">
                        {/* <div className="flex justify-end mb-1">
                            <Button label="Create New Board" onClick={createNewColumn} />
                        </div> */}
                        <SortableContext items={columnsId}>
                            <Each
                                of={columns}
                                render={(item) => (
                                    <ColumnContainer
                                        createTask={createTask}
                                        key={item.id}
                                        column={item}
                                        tasks={tasks.filter((task) => task.columnId === item.id)}
                                        deleteColumn={deleteColumn}
                                        updateColumn={updateColumn}
                                        updateTask={updateTask}
                                        deleteTask={deleteTask}
                                    />
                                )}
                            />
                        </SortableContext>


                    </div>
                    {createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <ColumnContainer
                                    column={activeColumn}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    tasks={tasks.filter(
                                        (task) => task.columnId === activeColumn.id
                                    )}
                                />
                            )}
                            {activeTask && (
                                <TaskCard
                                    task={activeTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    indexId="1"
                                />
                            )}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </div>
        </div>
    );
};

export default KanbanBoard;
