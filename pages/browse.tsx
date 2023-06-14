import CheckboxGroup from "@/components/CheckboxGroup";
import InfoModal from "@/components/InfoModal";
import Input from "@/components/Input";
import MovieList from "@/components/MovieList";
import Navbar from "@/components/Navbar";
import useCurrentUser from "@/hooks/useCurrentUser";
import useInfoModalStore from "@/hooks/useInfoModalStore";
import useVideos from "@/hooks/useVideoList";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Checkbox from "@material-tailwind/react/components/Checkbox";
import { TagsGroup } from "@/components/TagsGroup";
import useTags from "@/hooks/useTagList";

interface Props {}

const Browse = () => {
	const router = useRouter();
	const [showFavourites, setShowFavourites] = useState(
		router.query.showFavourites
	);
	const { data: allVideos, mutate } = useVideos();
	const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
	const [searchString, setSearchString] = useState("");
	const { data: currentUser } = useCurrentUser();
	const { isOpen, closeModal, openModal } = useInfoModalStore();
	const [selectedTags, setSelectedTags] = useState<any[]>([]);
	const { data: tags } = useTags();
	const toggleTagSelect = (tag: any) => {
		console.log(tag);
		selectedTags.includes(tag.id)
			? setSelectedTags(selectedTags.filter((stag) => stag != tag.id))
			: setSelectedTags([...selectedTags, tag.id]);
	};
	const isSelected = (tag: any) => selectedTags.includes(tag.id);
	useEffect(() => {
		let videoList = allVideos||[

		];
		videoList = videoList.filter((video:any)=>video.title?.includes(searchString) || video.description?.includes(searchString))
		
		if(selectedTags.length > 0)
			videoList = videoList.filter((video: any) =>selectedTags.some((tagId) =>video.tags && video.tags.map((tg: any) => tg.id).includes(tagId)))
		 
		setFilteredVideos(videoList)	
	}, [selectedTags,searchString]);

	useEffect(()=>{

	})

	useEffect(() => {
		setFilteredVideos(allVideos);
	}, [allVideos]);
	useEffect(() => {
		console.log(filteredVideos, "FILTERED");
	}, [filteredVideos]);
	// useEffect(()=>{
	//     let filtered = allVideos;
	//     if(showFavourites){
	//         filtered = filtered.filter(video=>video.)
	//     }
	//     setFilteredVideos((filteredVideos)=>allVideos.filter(video=>))
	// },[showFavourites])

	return (
		<>
			<InfoModal
				visible={isOpen}
				onClose={closeModal}
				successCallback={mutate}
			/>
			<div className="">
				<Navbar openModal={openModal} />
				<div className="container pt-32 mx-auto">
					<Input
						id="search"
						value={searchString}
						label={"Search videos"}
						onChange={(e: any) => setSearchString(e.target.value)}
						dark={false}
					/>
					<div className="flex justify-between mt-8">
						<div className="w-1/5 border-r-[1px] border-slate-600 pr-4 max-h-80 overflow-y-auto">
							{/* <CheckboxGroup /> */}
							{/* <Checkbox color="red" defaultChecked /> */}
							<TagsGroup
								tags={tags}
								toggleSelect={toggleTagSelect}
								isSelected={isSelected}
							/>
						</div>
						<div className="w-4/5">
							<MovieList title="Videos" data={filteredVideos} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Browse;
