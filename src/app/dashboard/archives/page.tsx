'use client'  
import React from 'react'; 
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useDeleteItems } from '@/hooks/useDatabase';
import { ExtendedFile, ExtendedFolder, useUserArchives } from '@/hooks/useArchives';  
import { ArrowUpDown, Calendar, ChevronRight, Edit, EllipsisVertical, File, Folder, LetterText, Package, Paperclip, Plus, Trash } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb" 
import { Button, IconButton } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { TooltipContent } from '@/components/ui/tooltip';
import FolderForm from '@/components/forms/folder-form';
import FileForm from '@/components/forms/file-form';
import { FormDialog } from '@/components/ui/dialog'; 
import { BorderedImageText } from '@/components/ui/border-image';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserProfile } from '@/hooks/useUser';
import { toast } from 'sonner'; 

const colHeaderSx = 'flex-row-center gap-2'  
const columns: ColumnDef<ExtendedFile>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        } 
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className='border-muted-foreground2'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
        className='border-muted-foreground2'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name", 
    header: () => (
      <div className={colHeaderSx}>
        <LetterText width={16} height={16} />
        Name
      </div>
    ),
    cell: ({ row }) => (
      <div className='underline underline-offset-2 decoration-muted-foreground2'>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "folderName", 
    header: () => (
      <div className={colHeaderSx}>
        <Folder width={16} height={16} />
        Folder
      </div>
    ),
    cell: ({ row }) => {
      const folderColor = row.original?.folderColor;
      return (
        <>
          { folderColor ? 
            <Badge className={`${folderColor} text-[0.78rem]`}>
              {row.getValue("folderName")}
            </Badge> 
            :
            <></>
          } 
        </>
      )
    }},
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className={colHeaderSx}>
          <Calendar width={15} height={15} />
          Date
          <Button 
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className='text-muted-foreground rounded-4xl'
          >
            <ArrowUpDown width={16} height={16} />
          </Button>
        </div> 
      )
    },
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "mimetype", 
    header: () => (
      <div className={colHeaderSx}>
        <Paperclip width={16} height={16} />
        Type
      </div>
    ),
    cell: ({ row }) => { 
      return <div className='pl-7'>{row.getValue("mimetype")}</div>
    }
  }
]

function FolderContainer({
  folder, 
  setOpenFolderId,
  onEdit,
  onDelete
}: {
  folder: ExtendedFolder; 
  setOpenFolderId: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void
}) {
  return (
    <div  
      onClick={() => setOpenFolderId(folder.id)}
      className='border-1 border-card-border hover rounded-sm w-60 h-fit py-3 pl-4 pr-2'
    >
      <div className='flex justify-end'> 
        <IconButton
          icon={ <EllipsisVertical width={20} height={20} className='text-muted-foreground' /> }
          menuContent={
            <DropdownMenuContent side='right' align='start'>  
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation(); 
                  onEdit();
                }}
              >
                <Edit />
                Edit
              </DropdownMenuItem> 
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation(); 
                  onDelete();
                }}
              >
                <Trash />
                Delete
              </DropdownMenuItem> 
            </DropdownMenuContent>
          } 
          onClick={(e) => e.stopPropagation()}  
        /> 
      </div>

      <Image src='/folder.png' alt='folder' width={65} height={65} /> 
      <div className='flex-row-between px-1 mt-2'> 
        <p className='text-[1.1rem] font-semibold'>{folder.name}</p> 
        { folder.filesCount > 0 &&  
          <Badge className={`${folder.color} text-[0.78rem]`}>
            {`${folder.filesCount} files`}
          </Badge> 
        }
      </div> 
    </div>  
  )
}

export default function Archives() {     
  const { data: user, isError: userError } = useUserProfile()      
  const [openFolderId, setOpenFolderId] = React.useState<string | null>(null)   
  type openType = { folder: ExtendedFolder | null; folders: ExtendedFolder[]; files: ExtendedFile[] } 
  const [open, setOpen] = React.useState<openType | null>(null)     
  const { data: archives, isFetching, error } = useUserArchives(user?.id)  
  React.useEffect(() => {     
    if (!archives) return;  
    if (openFolderId) {  
      setOpen({
        folder: archives.folders?.find((folder) => folder.id === openFolderId) ?? null,
        folders: archives.folders,
        files: archives.files?.filter((file) => file.folder_id === openFolderId) 
      })
    } 
    else { 
      setOpen({
        folder: null, 
        folders: archives.folders, 
        files: archives.files
      })
    }  
  }, [archives, openFolderId]) 
  const isLoading = !user || isFetching
  if (userError || error) redirect('/error')  
  const deleteItems = useDeleteItems()  

  function getFoldersToShow() { 
    return open?.folder ? [] : archives?.folders
  }

  // Forms 
  type FormType = { type: string | null, selected: ExtendedFolder | null }
  const [formData, setFormData] = React.useState<FormType>({ type: null, selected: null })
  const [formOpen, setFormOpen] = React.useState<boolean>(false)
  const closeForm = () => {
    setFormData({ type: null, selected: null })
    setFormOpen(false)
  } 
  const getFormType = () => { 
      if (formData.type === "Folder") {
        return <FolderForm selected={formData.selected} closeForm={closeForm} />
      } else if (formData.type === "File") {
        return <FileForm folderId={open?.folder?.id} closeForm={closeForm} /> 
      }
  }  

  const deleteItem = useDeleteItems()  
  async function deleteFolder(folder: ExtendedFolder) { 
    try {
      await deleteItem.mutateAsync({ 
        items: folder, 
        table: 'folders', 
        queryKeyId: user?.id, 
        queryKeyName: 'archives' 
      }) 
    } catch(err) {
      toast("Error occurred")
    } 
  }

  async function deleteFiles(rows: any[]) { 
    try {
      const files = rows.map((row) => row.original) 
      // files.forEach((file) => deleteStorageFile(file.path)) 
      await deleteItems.mutateAsync({ 
        items: files, 
        table: 'files', 
        queryKeyId: user?.id, 
        queryKeyName: 'archives' 
      })
    } catch (err) {
      toast("Error occurred")
    }
  }
 
  // Files Table
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({}) 
  const table = useReactTable({
      data: open?.files ?? [],
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
          sorting,
          columnFilters,
          columnVisibility,
          rowSelection,
      },
  })  

  return (
    <div className="flex-col-start px-10 min-lg:w-250 gap-10 mx-auto my-6">  
      <div className="flex-row-center gap-2 bg-foreground text-background w-fit px-3 rounded-md">  
        <Package width={47} height={47} />
        <p className='text-[3rem] font-bold'>Archives</p>
      </div>  
      { isLoading && 
        <div className="flex-col-start gap-5 mt-10">
           <div className="flex-row-start gap-4">
              <Skeleton className="h-[110px] w-[220px]" />
              <Skeleton className="h-[110px] w-[220px]" />
              <Skeleton className="h-[110px] w-[220px]" />
            </div>
          <Skeleton className="h-[125px] w-full" /> 
        </div>
      }
      { !isLoading && open && archives &&
        <>
          { archives?.folders?.length > 0 && archives?.files?.length > 0 ?
            <div className='flex-col-start gap-20 px-2'>
              {/* Folders */}
              <div className='flex-col-start gap-4'>
                <div className='flex-row-between'>  
                  <Breadcrumb className='flex flex-wrap'>
                    <BreadcrumbList>
                      <BreadcrumbItem onClick={() => setOpenFolderId(null)} className='hover:underline cursor-pointer'> 
                        All Folders   
                      </BreadcrumbItem>
                      { open.folder &&  
                        <BreadcrumbItem>
                          <ChevronRight width={14} height={14}/>
                          {open.folder.name}
                        </BreadcrumbItem> 
                      }
                    </BreadcrumbList>
                  </Breadcrumb> 
                  <Button 
                    onClick={() => {
                      setFormData({ type: 'Folder', selected: null }) 
                      setFormOpen(true)
                    }}
                  >  
                    <Folder /> 
                    Add Folder
                  </Button>
                </div>

                <div className='flex-row-start flex-wrap gap-10'>
                    { getFoldersToShow()?.map((folder) =>    
                      <FolderContainer 
                        key={folder.id} 
                        folder={folder} 
                        setOpenFolderId={setOpenFolderId}
                        onEdit={() => {
                          setFormData({ type: 'Folder', selected: folder }) 
                          setFormOpen(true)
                        }}
                        onDelete={() => deleteFolder(folder)}
                      />
                    )} 
                </div>  
              </div>

              {/* Files */}
              <div className="flex-col-start w-full gap-4"> 
                <div className='flex-row-between'>
                  <div className='flex-row-center gap-1.5 text-[1.8rem] font-bold'>
                    <File width={25} height={25} /> 
                    {`${open.folder?.name ?? ''} Documents `}
                  </div>
                  { table.getFilteredSelectedRowModel().rows.length > 0 ? 
                    <IconButton
                      icon={ <Trash width={20} height={20} className='text-muted-foreground' /> }
                      onClick={() => deleteFiles(table.getFilteredSelectedRowModel().rows) }
                      tooltipContent={
                        <TooltipContent className='bg-gray-primary' arrowClassName='bg-gray-primary fill-gray-primary'>
                          Delete Files
                        </TooltipContent>
                      } 
                    /> 
                    :
                    <IconButton
                      icon={ <Plus width={20} height={20} className='text-muted-foreground' /> }
                      onClick={() => {
                        setFormData({ type: 'File', selected: null }) 
                        setFormOpen(true)
                      }}
                      tooltipContent={
                        <TooltipContent className='bg-gray-primary' arrowClassName='bg-gray-primary fill-gray-primary'>
                          Add File
                        </TooltipContent>
                      } 
                    /> 
                  }
                </div> 

                <Table>
                  <TableHeader>
                    { table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}  className='hover:bg-transparent border-b-muted-background'>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className='text-muted-foreground'> 
                              {header.isPlaceholder ? null: flexRender(header.column.columnDef.header, header.getContext()) }
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>

                  <TableBody>
                      { table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, length) => (
                          <TableRow 
                            key={row.id} 
                            data-state={row.getIsSelected() && "selected"} 
                            className='border-muted-background hover:cursor-pointer'
                            onClick={() => window.open(row.original.path)}
                          >
                            { row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                        ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center" >
                            No results
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table> 

                <div className="flex-row-center justify-end gap-2 py-4">  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button> 
              </div>
              </div> 
            </div>
            :
            <div className='mt-10'>
              <BorderedImageText
                img={<Image src='/cat_folder.png' alt='folder' width={330} height={330} />}
                className='bg-blue-primary'
                title='No Files Found'
                subtitle='Click here to add a new file' 
                onClick={() => {
                  setFormData({ type: 'File', selected: null }) 
                  setFormOpen(true)
                }}
              /> 
            </div> 
          } 
            <FormDialog
              open={formOpen} 
              onOpenChange={setFormOpen}
              title={`${formData.selected === null ? 'Add' : 'Edit'} ${formData.type}`}
              form={getFormType()}
            />   
        </>
      }   
    </div>  
  );
}  

 
           
 