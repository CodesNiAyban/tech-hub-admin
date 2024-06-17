"use client";

import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";

// Map category names to SVG file paths
const iconMap: Record<string, string> = {
    "React": "react.svg",
    "Angular": "angular.svg",
    "Vue": "vue.svg",
    "Svelte": "svelte.svg",
    "Next.js": "/next.jpeg",
    "Nuxt.js": "nuxt.svg",
    "Gatsby": "gatsby.svg",
    "Ember.js": "ember.svg",
    "Backbone.js": "backbone.svg",
    "Meteor": "meteor.svg",
};

interface CategoriesProps {
    items: Category[];
}

export const Categories = ({
    items,
}: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-3 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    iconSrc={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    );
};