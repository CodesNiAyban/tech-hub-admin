"use client"

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Chapter, Course, MuxData } from "@prisma/client";
import { Pencil, PlusCircle, Replace } from "lucide-react";
import { useEffect, useState } from "react";
import { EditVideoForm } from "./set-video-form";
interface EditVideoDialogProps {
	toggleModal: () => void
	initialData: Chapter & { muxData?: MuxData | null }
	courseId: string;
	title: string
	description: string
	formLabel: string
	chapterId: string
}

export const EditVideoDialog = ({
	toggleModal,
	initialData,
	title,
	courseId,
	description,
	formLabel,
	chapterId,
}: EditVideoDialogProps) => {
	const [open, setOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
	}, []);

	const handleClose = () => {
		setOpen(false);
		toggleModal(); // Close the dialog
	};


	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="ghost" className="font-medium ml-auto">
						{!initialData.videoUrl ? (
							<>
								<PlusCircle className="h-5 w-5 mr-2" />
								Add {formLabel}
							</>
						) : (
							<>
								<Replace className="h-5 w-5 mr-2" />
								Replace {formLabel}
							</>
						)}
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>
							{description}
						</DialogDescription>
					</DialogHeader>
					<EditVideoForm
						initialData={initialData}
						courseId={courseId}
						formLabel={formLabel}
						toggleModal={handleClose}
						chapterId={chapterId}
					/>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="ghost" className="font-medium ml-auto">
					{!initialData.videoUrl ? (
						<>
							<PlusCircle className="h-5 w-5 mr-2" />
							Add {formLabel}
						</>
					) : (
						<>
							<Replace className="h-5 w-5 mr-2" />
							Replace {formLabel}
						</>
					)}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{formLabel}</DrawerTitle>
					<DrawerDescription>
						{description}
					</DrawerDescription>
				</DrawerHeader>
				<div className="px-4" >
					<EditVideoForm
						initialData={initialData}
						courseId={courseId}
						formLabel={formLabel}
						toggleModal={handleClose}
						chapterId={chapterId}
					/>
				</div>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
