import { Button } from "@/components/ui/button"

const ButtonsPage = () => {
    return (
        <div className="p-4 space-y-4 flex flex-col w-[200px]">
            <Button>Default</Button>
            <Button variant={'primary'}>Primary</Button>
            <Button variant={'primaryOutline'}>Outline</Button>
            <Button variant={'secondary'}>Secondary</Button>
            <Button variant={'secondaryOutline'}>Outline</Button>
            <Button variant={'danger'}>Danger</Button>
            <Button variant={'dangerOutline'}>Danger Outline</Button>
            <Button variant={'super'}>Super</Button>
            <Button variant={'superOutline'}>Super Outline</Button>
            <Button variant={'ghost'}>Ghost</Button>
            <Button variant={'sidebar'}>Sidebar</Button>
            <Button variant={'sidebarOutline'}>Sidebar Outline</Button>
        </div>
    )
}
export default ButtonsPage