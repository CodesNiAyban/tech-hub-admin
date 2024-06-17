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
import { Course } from "@prisma/client";
import { Pencil, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { EditPriceForm } from "./set-price-form";
interface EditPriceDialogProps {
	toggleModal: () => void
	initialData: Course
	courseId: string;
	title: string
	description: string
	formLabel: string
}

export const EditPriceDialog = ({
	toggleModal,
	initialData,
	title,
	courseId,
	description: description,
	formLabel
}: EditPriceDialogProps) => {
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
						{!initialData.price ? (
							<>
								<PlusCircle className="h-5 w-5 mr-2" />
								Set Price
							</>
						) : (
							<>
								<Pencil className="h-5 w-5 mr-2" />
								{title}
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
					<EditPriceForm
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
				<Button variant="ghost">
					{!initialData.price ? (
						<>
							<PlusCircle className="h-5 w-5 mr-2" />
							Set Price
						</>
					) : (
						<>
							<Pencil className="h-5 w-5 mr-2" />
							{title}
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
					<EditPriceForm
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
