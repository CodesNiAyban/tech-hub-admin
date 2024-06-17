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
import { Attachment, Course } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { EditAttachmentForm } from "./edit-attachment-form";
interface EditAttachmentDialogProps {
	toggleModal: () => void
	initialData: Course & { attachments: Attachment[] };
	courseId: string;
	title: string
	description: string
	formLabel: string
}

export const EditAttachmentDialog = ({
	toggleModal,
	initialData,
	title,
	courseId,
	description,
	formLabel
}: EditAttachmentDialogProps) => {
	const [open, setOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
	}, []);


	const handleClose = () => {
		setOpen(false);
		toggleModal(); 
	};


	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="ghost" className="font-medium ml-auto">
						<PlusCircle className="h-5 w-5 mr-2" />
						{title}
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>
							{description}
						</DialogDescription>
					</DialogHeader>
					<EditAttachmentForm
						initialData={initialData}
						courseId={courseId}
						formLabel={formLabel}
						toggleModal={handleClose}
					/>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="ghost" className="font-medium ml-auto">
					{title}
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
					<EditAttachmentForm
						initialData={initialData}
						courseId={courseId}
						formLabel={formLabel}
						toggleModal={handleClose}
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