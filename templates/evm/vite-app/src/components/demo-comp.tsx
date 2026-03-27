import { motion, AnimatePresence } from "framer-motion"
import { formatAddress, throwError } from "@trezo/evm"
import { useCallback, useEffect, useState } from "react"
import { Check, Info, Loader, Pencil, Trash2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { Button } from "@/components/ui/button"
import { config, ConnectButton } from "@/config/evm.config"
import { ScrollArea } from "./ui/scroll-area"

type TaskType = {
  id: number
  content: string
  completed: boolean
}

type LoadingState = {
  add: boolean
  toggle: Record<number, boolean>
  update: Record<number, boolean>
  delete: Record<number, boolean>
}

export const DemoComponent = () => {
  const { web3Provider, call, wallet } = config()

  const [tasks, setTasks] = useState<TaskType[]>([])
  const [newTask, setNewTask] = useState<string>("")
  const [editText, setEditText] = useState<string>("")
  const [maxContentLength, setMaxContentLength] = useState<number>(30)
  // const [initialFetchDone, setInitialFetchDone] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [loading, setLoading] = useState<LoadingState>({
    add: false,
    toggle: {},
    update: {},
    delete: {},
  })

  // ===== Derived loading states =====
  const isAnyDeleting = Object.values(loading.delete).some(Boolean)
  const isAnyUpdating = Object.values(loading.update).some(Boolean)
  const isAnyToggling = Object.values(loading.toggle).some(Boolean)

  const isBusy = loading.add || isAnyDeleting || isAnyUpdating || isAnyToggling

  // ===== Fetch helpers =====
  const fetchOtherFunctions = useCallback(async () => {
    try {
      const mxLgh = await call.queryFn("MAX_CONTENT_LENGTH", [])
      setMaxContentLength(Number(mxLgh.data))
    } catch (error) {
      console.error(error)
    }
  }, [call])

  const fetchAllTasks = async () => {
    try {
      const result = await call.queryFn("fetchAllTasks", [])
      if (result.error) throwError(result.rawError?.message)
      setTasks(result.data as unknown as TaskType[])
    } catch (error) {
      console.error(error)
    }
  }

  // ===== Actions =====

  const addTask = async () => {
    if (!newTask.trim()) return
    if (!wallet.account.isConnected) return

    setLoading((prev) => ({ ...prev, add: true }))

    try {
      const result = await call.mutateFn("addTask", [newTask.trim()])

      if (result.error) {
        throw new Error(result.error.message)
      }
      setNewTask("")
      setError(null)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to add task")
    } finally {
      setLoading((prev) => ({ ...prev, add: false }))
    }
  }

  const toggleTaskComplete = async (id: number) => {
    if (!wallet.account.isConnected) return
    setLoading((prev) => ({
      ...prev,
      toggle: { ...prev.toggle, [id]: true },
    }))

    try {
      const result = await call.mutateFn("toggleTaskComplete", [BigInt(id)])

      if (result.error) {
        throw new Error(result.error.message)
      }

      setError(null)
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to toggle task completion"
      )
    } finally {
      setLoading((prev) => ({
        ...prev,
        toggle: { ...prev.toggle, [id]: false },
      }))
    }
  }

  const updateTaskContent = async (id: number) => {
    if (!editText.trim()) return
    if (!wallet.account.isConnected) return

    setLoading((prev) => ({
      ...prev,
      update: { ...prev.update, [id]: true },
    }))

    try {
      const result = await call.mutateFn("updateTaskContent", [
        BigInt(id),
        editText.trim(),
      ])

      if (result.error) {
        throw new Error(result.error.message)
      }

      setEditingId(null)
      setEditText("")
      setError(null)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to update task")
    } finally {
      setLoading((prev) => ({
        ...prev,
        update: { ...prev.update, [id]: false },
      }))
    }
  }

  const removeTask = async (id: number) => {
    if (!wallet.account.isConnected) return
    setLoading((prev) => ({
      ...prev,
      delete: { ...prev.delete, [id]: true },
    }))

    try {
      const result = await call.mutateFn("removeTask", [BigInt(id)])

      if (result.error) {
        throw new Error(result.error.message)
      }

      setError(null)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to remove task")
    } finally {
      setLoading((prev) => ({
        ...prev,
        delete: { ...prev.delete, [id]: false },
      }))
    }
  }

  // ===== Effects =====

  useEffect(() => {
    queueMicrotask(() => {
      fetchAllTasks()
      fetchOtherFunctions()
      // setInitialFetchDone(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call, wallet.account.address])

  useEffect(() => {
    // if (!initialFetchDone) return

    const cleanup = call.listenMany({
      add: { eventName: "TaskAdded", listener: fetchAllTasks },
      update: { eventName: "TaskUpdated", listener: fetchAllTasks },
      remove: { eventName: "TaskRemoved", listener: fetchAllTasks },
      toggle: { eventName: "TaskToggled", listener: fetchAllTasks },
    })

    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ===== UI =====

  return (
    <div className="space-y-2">
      <ConnectButton>
        {({ isConnected, ensName, address, open }) => (
          <Button onClick={() => open({ view: "Account" })}>
            {isConnected ? (ensName ?? formatAddress(address)) : "Connect"}
          </Button>
        )}
      </ConnectButton>
      <div
        className={cn("pointer-events-auto space-y-2", {
          "pointer-events-none opacity-50": !wallet.account.isConnected,
          "pointer-events-none animate-pulse": wallet.account.isConnecting,
        })}
      >
        {/* ===== Add Task ===== */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Input
              value={newTask}
              disabled={!web3Provider.isAvailable || isBusy}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              aria-invalid={newTask.length >= maxContentLength}
            />

            <Button
              onClick={addTask}
              isLoading={loading.add}
              disabled={
                !web3Provider.isAvailable ||
                newTask.length >= maxContentLength ||
                isAnyDeleting
              }
            >
              Add Task
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <Info size={14} />
              {error}
            </div>
          )}
        </div>

        {/* ===== Task List ===== */}
        {tasks.length > 0 && (
          <ScrollArea className="max-h-[200px] overflow-y-auto">
            <AnimatePresence initial={false}>
              <motion.div layout className="flex flex-col gap-2">
                {tasks.map((task) => {
                  const isDeleting = loading.delete[task.id]
                  const isUpdating = loading.update[task.id]
                  const isToggling = loading.toggle[task.id]
                  const disabled =
                    isDeleting || isUpdating || isToggling || isAnyDeleting

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "group flex h-[50px] flex-1 items-center gap-3 rounded-lg border px-2 py-2 text-sm squircle hover:bg-secondary/40 hover:dark:bg-secondary/20",
                        { "pointer-events-none animate-pulse": disabled }
                      )}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {editingId === task.id ? (
                          <motion.div
                            key={`edit-${task.id}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex w-full items-center gap-3"
                          >
                            <Input
                              autoFocus
                              value={editText}
                              disabled={isUpdating || isAnyDeleting}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && updateTaskContent(task.id)
                              }
                              aria-invalid={editText.length >= maxContentLength}
                            />

                            <Button
                              size="icon-sm"
                              variant="ghost"
                              isLoading={isUpdating}
                              onClick={() => updateTaskContent(task.id)}
                              disabled={
                                editText.length >= maxContentLength ||
                                isAnyDeleting
                              }
                            >
                              <Check className="size-3.5" />
                            </Button>

                            <Button
                              size="icon-sm"
                              variant="destructive"
                              disabled={isUpdating || isAnyDeleting}
                              onClick={() => setEditingId(null)}
                            >
                              <X className="size-3.5" />
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key={`view-${task.id}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex w-full items-center gap-3"
                          >
                            {isToggling ? (
                              <Loader className="size-4 animate-spin" />
                            ) : (
                              <Checkbox
                                id={`toggle-${task.id}`}
                                checked={task.completed}
                                disabled={disabled}
                                onCheckedChange={() =>
                                  toggleTaskComplete(task.id)
                                }
                              />
                            )}

                            <label
                              htmlFor={`toggle-${task.id}`}
                              className={cn(
                                task.completed &&
                                  "text-muted-foreground line-through"
                              )}
                            >
                              {task.content}
                            </label>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="ml-auto flex gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          disabled={disabled}
                          onClick={() => {
                            setEditingId(task.id)
                            setEditText(task.content)
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>

                        <Button
                          size="icon-sm"
                          variant="destructive"
                          isLoading={isDeleting}
                          loadingText=""
                          disabled={isAnyDeleting && !isDeleting}
                          onClick={() => removeTask(task.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
