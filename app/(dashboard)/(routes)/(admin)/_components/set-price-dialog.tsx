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

import { priceSchema } from "@/app/(dashboard)/(routes)/teacher/courses/_components/_utils/form-validation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscriptionPrices } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface EditPriceDialogProps {
	initialData: SubscriptionPrices
}

export const EditPriceDialog = ({
	initialData,
}: EditPriceDialogProps) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false); // State variable for submission status

	const form = useForm<z.infer<typeof priceSchema>>({
		resolver: zodResolver(priceSchema),
		defaultValues: {
			price: initialData?.price || undefined,
		},
	});

	const editPrice = async (values: z.infer<typeof priceSchema>) => {
		setIsSubmitting(true);
		try {
			const response = await axios.patch(`/api/pricing/${initialData.id}`, values);
			router.refresh();
			return response;
		} catch (error) {
			console.log(error)
			throw error
		} finally {
			setIsSubmitting(false);
			setOpen(false);
		}
	};

	const onSubmit = async (values: z.infer<typeof priceSchema>) => {
		try {
			const response = toast.promise(editPrice(values), {
				loading: "Processing",
				error: "An error occured, please try again later.",
				success: "Course Price Updated!"
			});
			return response;
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" className="font-medium ml-auto">
					<Pencil className="h-4 w-4 mr-2" /> Edit Price
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Set Price</DialogTitle>
					<DialogDescription>
						Set your new Price.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form id="edit-course" onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4")}>
						<div className="grid gap-6">
							<div className="grid gap-3">
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-medium flex items-center justify-between">
												Price
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													disabled={isSubmitting}
													placeholder="Set a price to your course"
													type="number"
													step="0.01"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<Button type="submit" disabled={isSubmitting}> {/* Disable button while submitting */}
							Save
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
