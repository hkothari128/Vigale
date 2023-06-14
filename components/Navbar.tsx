import React, { useCallback, useEffect, useState } from "react";
import {
	BellIcon,
	MagnifyingGlassIcon,
	ChevronDownIcon,
} from "@heroicons/react/24/outline";

import AccountMenu from "@/components/AccountMenu";
import MobileMenu from "@/components/MobileMenu";
import NavbarItem from "@/components/NavbarItem";
import useInfoModalStore from "@/hooks/useInfoModalStore";
import { useRouter } from "next/router";

const TOP_OFFSET = 66;

interface NavbarProps {
	openModal: Function;
}
const Navbar: React.FC<NavbarProps> = ({ openModal }) => {
	const [showAccountMenu, setShowAccountMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showBackground, setShowBackground] = useState(false);
	const [active, setActive] = useState("home");
	const router = useRouter();
	const navLinks = [
		{ id: "home", label: "Home", path: "/" },
		{ id: "mylist", label: "My List", path: "/browse?showFavourites=true" },
		{ id: "browse", label: "Browse All Videos", path: "/browse" },
	];
	useEffect(() => {
		const handleScroll = () => {
			console.log(window.scrollY);
			if (window.scrollY >= TOP_OFFSET) {
				setShowBackground(true);
			} else {
				setShowBackground(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const toggleAccountMenu = useCallback(() => {
		setShowAccountMenu((current) => !current);
	}, []);

	const toggleMobileMenu = useCallback(() => {
		setShowMobileMenu((current) => !current);
	}, []);

	const navbarNavigate = (navLink: any) => {
		setActive(navLink.id);
		router.push(navLink.path);
	};

	return (
		<nav className="w-full fixed z-40">
			<div
				className={`px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 ${
					showBackground ? "bg-zinc-900 bg-opacity-90" : ""
				}`}
			>
				{/* <img src="/images/logo.png" className="h-4 lg:h-7" alt="Logo" /> */}
				<div className="flex-row ml-8 gap-7 hidden lg:flex">
					{navLinks.map((navLink) => (
						<div
							className="cursor-pointer hover:opacity-80"
							onClick={() => navbarNavigate(navLink)}
						>
							<NavbarItem label={navLink.label} active={active == navLink.id} />
						</div>
					))}

					{/* <NavbarItem label="My List" />
					<NavbarItem label="Browse All Videos" /> */}
				</div>
				<div
					onClick={toggleMobileMenu}
					className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative"
				>
					<p className="text-white text-sm">Browse</p>
					<ChevronDownIcon
						className={`w-4 text-white fill-white transition ${
							showMobileMenu ? "rotate-180" : "rotate-0"
						}`}
					/>
					<MobileMenu visible={showMobileMenu} />
				</div>
				<div className="flex flex-row ml-auto gap-7 items-center">
					<div
						className="rounded-lg ml-auto py-2 px-3 mr-2 bg-indigo-500 text-white text-muted hover:opacity-80 cursor-pointer"
						onClick={() => openModal()}
					>
						Add Video
					</div>
					<div
						onClick={toggleAccountMenu}
						className="flex flex-row items-center gap-2 cursor-pointer relative"
					>
						<div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
							<img src="/images/default-blue.png" alt="" />
						</div>
						<ChevronDownIcon
							className={`w-4 text-white fill-white transition ${
								showAccountMenu ? "rotate-180" : "rotate-0"
							}`}
						/>
						<AccountMenu visible={showAccountMenu} />
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
