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
import { Category, Course } from "@prisma/client";
import { Pencil, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { EditCategoriesForm } from "./edit-categories-form";

interface EditCategoriesProps {
	toggleModal: () => void
	initialData: Course & { categories: Category[] };
	title: string
	courseId: string;
	categories: {
		id: string;
		name: string;
	}[]
	description: string
	formLabel: string
}

export const EditCategoriesDialog = ({
	toggleModal,
	initialData,
	categories,
	title,
	courseId,
	description,
	formLabel
}: EditCategoriesProps) => {
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
					<Button variant="ghost" className="font-medium">
						{initialData.categories.length > 0 ? (
							<>
								<Pencil className="h-5 w-5 mr-2" />
								{title}
							</>
						) : (
							<>
								<PlusCircle className="h-5 w-5 mr-2" />
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
					<EditCategoriesForm
						initialData={initialData}
						courseId={courseId}
						formLabel={formLabel}
						toggleModal={handleClose}
						categories={categories}
					/>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="ghost">
					{initialData.categories.length > 0 ? (
						<>
							<Pencil className="h-5 w-5 mr-2" />
							{title}
						</>
					) : (
						<>
							<PlusCircle className="h-5 w-5 mr-2" />
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
					<EditCategoriesForm
						initialData={initialData}
						courseId={courseId}
						formLabel={formLabel}
						toggleModal={handleClose}
						categories={categories}
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
