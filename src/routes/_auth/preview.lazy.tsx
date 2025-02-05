import { Button } from '@/components/ui/button'
import PaperHeader from '@/features/Builder/PaperHeader'
import { useQuestionBuilderStore } from '@/store/useQuestionBuilderStore'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFontSizeStore } from '@/store/useFontSizeStore'

export const Route = createLazyFileRoute('/_auth/preview')({
  component: RouteComponent,
})

function RouteComponent() {
  const pageRef = useRef<HTMLDivElement>(null)
  const lastElementRef = useRef<HTMLDivElement>(null)

  const currentFontSize = useFontSizeStore((state) => state.currentFontSize)
  const setFontSize = useFontSizeStore((state) => state.setFontSize)

  const [duplicateCapacity, setDuplicateCapacity] = useState(0)

  const calcFn = () => {
    if (pageRef.current && lastElementRef.current) {
      // Page = EmptySpace + Content
      // therefore if: EmptySpace > Page - Content then: Duplicate Content else: move on

      const totalPageHeight = pageRef.current.getBoundingClientRect().height
      const parentTop = pageRef.current.getBoundingClientRect().top
      const lastContent = lastElementRef.current.getBoundingClientRect().bottom
      const heightToLastContent = lastContent - parentTop

      console.log(
        totalPageHeight,
        heightToLastContent,
        'duplicate capacity: ',
        Math.round(totalPageHeight / heightToLastContent),
      )

      setDuplicateCapacity(Math.round(totalPageHeight / heightToLastContent))
    }
  }

  const calcFontSize = (value: string) => {
    setFontSize(value)
  }

  return (
    <div className="w-full">
      <div className="mx-auto h-[calc(100vh-72px)] max-w-7xl space-y-3 overflow-y-auto bg-slate-100 p-6">
        <div className="flex items-center gap-2">
          <Button onClick={calcFn}>Calculate</Button>
          <Select value={currentFontSize} onValueChange={calcFontSize}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Font Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-2">12</SelectItem>
              <SelectItem value="-1">14</SelectItem>
              <SelectItem value="0">16</SelectItem>
              <SelectItem value="1">18</SelectItem>
              <SelectItem value="2">20</SelectItem>
              <SelectItem value="3">22</SelectItem>
              <SelectItem value="4">24</SelectItem>
              <SelectItem value="5">26</SelectItem>
              <SelectItem value="6">28</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <A4Page
          pageRef={pageRef}
          lastElementRef={lastElementRef}
          duplicateCapacity={duplicateCapacity}
        />
      </div>
    </div>
  )
}

const A4Page = ({
  pageRef,
  lastElementRef,
  duplicateCapacity,
}: {
  pageRef: React.RefObject<HTMLDivElement>
  lastElementRef: React.RefObject<HTMLDivElement>
  duplicateCapacity: number
}) => {
  const fields = useQuestionBuilderStore((state) => state.fields)
  const currentFontSize = useFontSizeStore((state) => state.currentFontSize)

  return (
    <div
      className="mx-auto h-[297mm] w-[210mm] border border-gray-300 bg-white p-4 shadow-md"
      ref={pageRef}
    >
      {Array(duplicateCapacity === 0 ? 1 : duplicateCapacity)
        .fill(0)
        .map((_, i) => (
          <Fragment key={i}>
            <PaperHeader />

            <div className="flex w-full flex-col gap-3">
              {fields.map((question, i) => (
                <div
                  className="h-10 w-full bg-slate-200"
                  key={question.id}
                  ref={i === fields.length - 1 ? lastElementRef : null}
                >
                  <p style={{ fontSize: 16 + Number(currentFontSize) }}>
                    {question.value}
                  </p>
                </div>
              ))}
            </div>
          </Fragment>
        ))}
    </div>
  )
}
// const A4Page = () => {
//   return (
//     <div className="mx-auto h-[297mm] w-[210mm] border border-gray-300 bg-white p-6 shadow-md">
//       Ass
//     </div>
//   );
// };
