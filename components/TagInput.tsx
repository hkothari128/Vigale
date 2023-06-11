import React, { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
interface Props {}

const TagInput = (props: Props) => {
	const {} = props;
	const KeyCodes = {
		comma: 188,
		enter: 13,
	};
	const [searched, setSearched] = useState("");
	const inittagList = [
		{ id: "a", text: "a" },
		{ id: "b", text: "b" },
		{ id: "c", text: "c" },
		{ id: "d", text: "d" },
		{ id: "e", text: "e" },
		{ id: "f", text: "f" },
		{ id: "g", text: "g" },
		{ id: "h", text: "h" },
		{ id: "ia", text: "ia" },
		{ id: "b a", text: "b a" },
		{ id: "c 1", text: "c 1" },
		{ id: "d 2", text: "d 2" },
		{ id: "x 3", text: "x 3" },
		{ id: "b 34", text: "b 34" },
	];
	const [tagList, setTagList] = useState(inittagList);
	const delimiters = [KeyCodes.comma, KeyCodes.enter];
	const [tags, setTags] = useState([
		{ id: "Thailand", text: "Thailand" },
		{ id: "India", text: "India" },
		{ id: "Vietnam", text: "Vietnam" },
		{ id: "Turkey", text: "Turkey" },
	]);
	const handleDelete = (i: any) => {
		const deleted = tags.find((tag, index) => index == i);
		setTags(tags.filter((tag, index) => index !== i));
		if (deleted) setTagList([...tagList, deleted]);
	};

	const handleAddition = (tag: any) => {
		setTags([...tags, tag]);
	};
	const addFromTagList = (tag: any) => {
		handleAddition(tag);
		setTagList(tagList.filter((tg) => tg.id !== tag.id));
	};

	return (
		<div className="flex items-start">
			<div className="w-1/2">
				<ReactTags
					tags={tags}
					delimiters={delimiters}
					handleDelete={handleDelete}
					handleAddition={handleAddition}
					// handleDrag={handleDrag}
					// handleTagClick={handleTagClick}
					inputFieldPosition="bottom"
					placeholder="Enter New Tags"
					editable
				/>
			</div>
			<div className="h-80 min-w-1/2 w-1/2 flex flex-col ml-4  text-white">
				<input
					className="block py-2 px-3 mb-2 w-full text-sm text-gray-50 placeholder-gray-50 font-medium outline-none bg-transparent border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
					type="text"
					value={searched}
					onChange={(e) => setSearched(e.target.value)}
					placeholder="Search Tags"
				/>
				<div className="overflow-y-auto border-gray-400 border-[1px] rounded-lg p-4 flex-grow ">
					{tagList
						.filter((tag) => tag.text.startsWith(searched))
						.map((filteredTag) => {
							return (
								<span
									key={filteredTag.id}
									onClick={() => addFromTagList(filteredTag)}
									className="tag-wrapper ReactTags__tag my-1 hover:scale-1 cursor-pointer w-fit"
									draggable="true"
								>
									{filteredTag.text}
									<button
										className="ReactTags__remove"
										type="button"
										aria-label="Tag at index 0 with value Thailand focussed. Press backspace to remove"
									>
										×
									</button>
								</span>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default TagInput;
