import React, { useCallback, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import PlayButton from "@/components/PlayButton";
import FavoriteButton from "@/components/FavoriteButton";
import useInfoModalStore from "@/hooks/useInfoModalStore";
import useVideo from "@/hooks/useVideo";
import Input from "./Input";
import axios from "axios";
import TagInput from "./TagInput";
import useTags from "@/hooks/useTagList";
import { clone, now } from "lodash";
import { Tag, Video } from "@prisma/client";


interface InfoModalProps {
	visible?: boolean;
	onClose: any;
	successCallback:Function
}


const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, successCallback }) => {
	const [isVisible, setIsVisible] = useState<boolean>(!!visible);
	const [videoFile, setVideo] = useState<File>();
	const [loading, setLoading] = useState(false);
	const [title, setTitle] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
	const [description, setDescription] = useState("");
  const { data: initTagList = [] } = useTags();
  const [progress, setProgress] = useState(0);
 

	// const [tags, setTags] = useState([]);

	const {} = useInfoModalStore();

	useEffect(() => {
		setIsVisible(!!visible);
	}, [visible]);

	const handleClose = useCallback(() => {
		setIsVisible(false);
		setTimeout(() => {
			onClose();
		}, 300);
	}, [onClose]);

	const addMovie = async () => {
		const formData = new FormData();
		if (videoFile) formData.append("file", videoFile);
		formData.append("upload_preset", "vigale");
		formData.append("cloud_name", "dlk0tfo07");
    setLoading(true)
    try{
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dlk0tfo07/video/upload",
        formData,{
			headers: {
			  "Content-Type": "multipart/form-data",
			},
			onUploadProgress: (progressEvent) => {
				if(progressEvent.total){
					console.log("UPLOAD",progressEvent)
					const progress = (progressEvent.loaded / progressEvent.total) * 50;
					setProgress(progress);
				}
			},
			onDownloadProgress: (progressEvent) => {
				if(progressEvent.total){
					console.log("Download",progressEvent)
					const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
					console.log(progress);
					setProgress(progress);
				}
			},
		  }
      );

      const newTags = tags.filter(tag=>!initTagList.includes(tag))
	  let tagAddedResponse;
     if(newTags?.length){
		 tagAddedResponse = await axios.post("/api/tags",{
		   newTags
		 })
	 } 

      if(!!cloudinaryResponse?.data?.url && (!tagAddedResponse || tagAddedResponse.status==201)){
        const video = {
          title,
          description,
          url:cloudinaryResponse.data.url,
          preview_url:cloudinaryResponse.data.url.replace('/upload/','/upload/e_preview:duration_15:max_seg_5:min_seg_dur_3/'),
		  thumbnailUrl:cloudinaryResponse.data.url.substring(0,cloudinaryResponse.data.url.lastIndexOf('.')) + '.jpg',
		  upload_date: new Date()
        }
		const videoAddedResponse = await axios.post("/api/videos",{videoData:video,tags:tags.map(tag=>({id:tag.id}))})
		handleClose();
		successCallback();
      }
    } catch(e){
      console.log("ERROR",e)
    } finally {
      setLoading(false)
    }
		// formData.append("title", title);
		// formData.append("description", description);

		// const output = await axios.post("/api/movies", formData, {
		// 	headers: {
		// 		"Content-Type": "multipart/form-data",
		// 	},
		// });
		// console.log("output", output);
	};

	if (!visible) {
		return null;
	}

	return (
		<div className="z-50 transition duration-300 bg-black bg-opacity-80 flex justify-center items-center overflow-x-hidden fixed inset-0">
			<div className="relative w-[50%] rounded-md min-h-[50vh] h-[90vh]">
				<div
					className={`${
						isVisible ? "scale-100" : "scale-0"
					} transform duration-300 relative flex-auto bg-indigo-900 drop-shadow-md overflow-auto w-full h-full`}
				>
					<div className="relative flex items-center h-16 border-b-[1px] border-gray-400 mb-4">
            <div className="text-white text-2xl mx-2">ADD NEW VIDEO</div>
						<div
							onClick={handleClose}
							className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-indigo bg-opacity-70 flex items-center justify-center"
						>
							<XMarkIcon className="text-white w-6" />
						</div>
					</div>
					<div className="w-full px-8">
						<div className="flex flex-wrap items-start -mx-4 pb-8 mb-8  border-gray-400 border-opacity-20">
							<div className="w-full sm:w-1/3 px-4 mb-6 sm:mb-0">
								<span className="block text-sm font-medium text-gray-100">
									Video
								</span>
							</div>
							<div className="w-full sm:w-2/3 px-4">
								<div className="flex flex-wrap sm:flex-nowrap max-w-xl">
									<div className="w-full py-8 px-4 text-center border-dashed border border-gray-400 hover:border-white focus:border-green-500 rounded-lg">
										{videoFile ? (
											<div className="flex justify-between">
												<span>{videoFile.name}</span>
												<XMarkIcon
													onClick={() => setVideo(undefined)}
													className="cursor-pointer text-white w-6"
												/>
											</div>
										) : (
											<>
												<div className="relative group h-14 w-14 mx-auto mb-4">
													<div className="flex items-center justify-center h-14 w-14 bg-blue-500 group-hover:bg-blue-600 rounded-full">
														<svg
															width="20"
															height="20"
															viewBox="0 0 20 20"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M6.71 5.71002L9 3.41002V13C9 13.2652 9.10536 13.5196 9.29289 13.7071C9.48043 13.8947 9.73478 14 10 14C10.2652 14 10.5196 13.8947 10.7071 13.7071C10.8946 13.5196 11 13.2652 11 13V3.41002L13.29 5.71002C13.383 5.80375 13.4936 5.87814 13.6154 5.92891C13.7373 5.97968 13.868 6.00582 14 6.00582C14.132 6.00582 14.2627 5.97968 14.3846 5.92891C14.5064 5.87814 14.617 5.80375 14.71 5.71002C14.8037 5.61706 14.8781 5.50645 14.9289 5.3846C14.9797 5.26274 15.0058 5.13203 15.0058 5.00002C15.0058 4.86801 14.9797 4.7373 14.9289 4.61544C14.8781 4.49358 14.8037 4.38298 14.71 4.29002L10.71 0.290018C10.6149 0.198978 10.5028 0.127613 10.38 0.0800184C10.1365 -0.0199996 9.86346 -0.0199996 9.62 0.0800184C9.49725 0.127613 9.3851 0.198978 9.29 0.290018L5.29 4.29002C5.19676 4.38326 5.1228 4.49395 5.07234 4.61577C5.02188 4.73759 4.99591 4.86816 4.99591 5.00002C4.99591 5.13188 5.02188 5.26245 5.07234 5.38427C5.1228 5.50609 5.19676 5.61678 5.29 5.71002C5.38324 5.80326 5.49393 5.87722 5.61575 5.92768C5.73757 5.97814 5.86814 6.00411 6 6.00411C6.13186 6.00411 6.26243 5.97814 6.38425 5.92768C6.50607 5.87722 6.61676 5.80326 6.71 5.71002ZM19 10C18.7348 10 18.4804 10.1054 18.2929 10.2929C18.1054 10.4804 18 10.7348 18 11V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8947 17.2652 18 17 18H3C2.73478 18 2.48043 17.8947 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V11C2 10.7348 1.89464 10.4804 1.70711 10.2929C1.51957 10.1054 1.26522 10 1 10C0.734784 10 0.48043 10.1054 0.292893 10.2929C0.105357 10.4804 0 10.7348 0 11V17C0 17.7957 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7957 20 17V11C20 10.7348 19.8946 10.4804 19.7071 10.2929C19.5196 10.1054 19.2652 10 19 10Z"
																fill="#E8EDFF"
															></path>
														</svg>
													</div>
													<input
														className="absolute top-0 left-0 h-14 w-14 opacity-0"
														id="formInput1-4"
														type="file"
														name="video"
														value={videoFile}
														onChange={(e) => {
															// console.log(e.target);
															setVideo(
																e.target.files ? e.target.files[0] : undefined
															);
														}}
													/>
												</div>
												<p className="font-semibold leading-normal mb-1">
													<span className="text-blue-500">
														Click to upload a file
													</span>
												</p>
												<span className="text-xs text-gray-300 font-semibold">
													mp4/mov file
												</span>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-wrap items-start -mx-4 pb-8 mb-8  border-gray-400 border-opacity-20">
							<div className="w-full sm:w-1/3 px-4 mb-4 sm:mb-0">
								<span className="text-sm font-medium text-gray-100">Title</span>
							</div>
							<div className="w-full sm:w-2/3 px-4">
								<div className="max-w-xl">
									<input
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										className="block py-4 px-3 w-full text-sm text-gray-50 placeholder-gray-50 font-medium outline-none bg-transparent border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
										id="formInput1-3"
										type="text"
										placeholder="Enter Video Title(Default will be the file name)"
									/>
								</div>
							</div>
						</div>
						<div className="flex flex-wrap items-start -mx-4 pb-8 mb-8  border-gray-400 border-opacity-20">
							<div className="w-full sm:w-1/3 px-4 mb-4 sm:mb-0">
								<span className="text-sm font-medium text-gray-100">
									Description
								</span>
							</div>
							<div className="w-full sm:w-2/3 px-4">
								<div className="max-w-xl">
									<input
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										className="block py-4 px-3 w-full text-sm text-gray-50 placeholder-gray-50 font-medium outline-none bg-transparent border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
										id="formInput1-3"
										type="textarea"
										placeholder="Enter Video Description"
									/>
								</div>
							</div>
						</div>
            <div className="flex flex-wrap items-start -mx-4 pb-8 mb-8  border-gray-400 border-opacity-20">
							<div className="w-full sm:w-1/3 px-4 mb-4 sm:mb-0">
								<span className="text-sm font-medium text-gray-100">
									Tags
								</span>
							</div>
							<div className="w-full sm:w-2/3 px-4">
								<div className="max-w-xl">
                <TagInput tags={tags} setTags={setTags} initTagList={clone(initTagList)} />
								</div>
							</div>
						</div>
            
           
					</div>
					<div className="max-w-xl mx-auto text-center pb-4 cursor-pointer hover:opacity-80">
						<div
							onClick={() => addMovie()}
							className="md:w-11/12 w-3/4 m-2 inline-block px-5 py-4 text-gray-700 font-semibold tracking-tight bg-white hover:bg-gray-100 rounded-lg focus:ring-4 focus:ring-gray-200 transition duration-200"
						>
							{!loading?'Add video':<div role="status">
    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <div className="sr-only text-black">Loading... {progress-0.23}</div>
</div>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InfoModal;
