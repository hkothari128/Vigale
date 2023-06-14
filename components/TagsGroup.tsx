import useTags from "@/hooks/useTagList";
import React, { useState } from "react";

type TagGroupProps = {
	toggleSelect: Function;
	isSelected: Function;
	tags: any[];
};

const TagsGroup: React.FC<TagGroupProps> = ({
	tags,
	toggleSelect,
	isSelected,
}) => {
	return (
		<div className="grid md:grid-cols-2 grid-cols-1">
			{tags &&
				tags.map((tag: any) => (
					<div
						data-te-toggle="tooltip"
						data-te-placement="top"
						data-te-ripple-init
						data-te-ripple-color="dark"
						title={tag.text}
						key={tag.id}
						className={`video-tags hover:opacity-75 cursor-pointer transition-colors ${
							isSelected(tag) ? "!bg-green-700" : ""
						}`}
						onClick={() => toggleSelect(tag)}
					>
						{tag.text}
					</div>
				))}
		</div>
	);
};

TagsGroup.propTypes = {};

export { TagsGroup };
