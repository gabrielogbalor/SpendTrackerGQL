// import { FaLocationDot } from "react-icons/fa6";
// import { BsCardText } from "react-icons/bs";
// import { MdOutlinePayments } from "react-icons/md";
// import { FaSackDollar } from "react-icons/fa6";
// import { FaTrash } from "react-icons/fa";
// import { HiPencilAlt } from "react-icons/hi";
// import { Link } from "react-router-dom";
// import { useMutation } from "@apollo/client";
// import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
// import { GET_TRANSACTIONS, GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
// import toast from "react-hot-toast";

// const categoryColorMap = {
// 	saving: "from-green-700 to-green-400",
// 	expense: "from-pink-800 to-pink-600",
// 	investment: "from-blue-700 to-blue-400",
// 	// Add more categories and corresponding color classes as needed
// };

// const Card = ({ transaction }) => {
// 	const cardClass = categoryColorMap[transaction.category] || "from-gray-700 to-gray-400";
	
// 	const [deleteTransaction, { loading: deleteLoading }] = useMutation(DELETE_TRANSACTION, {
// 		refetchQueries: [
// 			{ query: GET_TRANSACTIONS },
// 			{ query: GET_TRANSACTION_STATISTICS }
// 		],
// 		onError: (error) => {
// 			toast.error(error.message);
// 		},
// 		onCompleted: () => {
// 			toast.success("Transaction deleted successfully");
// 		}
// 	});
	
// 	const handleDelete = async () => {
// 		try {
// 			await deleteTransaction({ 
// 				variables: { transactionId: transaction._id }
// 			});
// 		} catch (error) {
// 			// Error is handled in onError callback
// 		}
// 	};
	
// 	// Format date for display
// 	const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
// 		day: 'numeric',
// 		month: 'short',
// 		year: 'numeric'
// 	});

// 	return (
// 		<div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
// 			<div className='flex flex-col gap-3'>
// 				<div className='flex flex-row items-center justify-between'>
// 					<h2 className='text-lg font-bold text-white'>{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</h2>
// 					<div className='flex items-center gap-2'>
// 						<FaTrash className={"cursor-pointer"} onClick={handleDelete} />
// 						<Link to={`/transaction/${transaction._id}`}>
// 							<HiPencilAlt className='cursor-pointer' size={20} />
// 						</Link>
// 					</div>
// 				</div>
// 				<p className='text-white flex items-center gap-1'>
// 					<BsCardText />
// 					Description: {transaction.description}
// 				</p>
// 				<p className='text-white flex items-center gap-1'>
// 					<MdOutlinePayments />
// 					Payment Type: {transaction.paymentType}
// 				</p>
// 				<p className='text-white flex items-center gap-1'>
// 					<FaSackDollar />
// 					Amount: ${transaction.amount}
// 				</p>
// 				<p className='text-white flex items-center gap-1'>
// 					<FaLocationDot />
// 					Location: {transaction.location || "N/A"}
// 				</p>
// 				<div className='flex justify-between items-center'>
// 					<p className='text-xs text-black font-bold'>{formattedDate}</p>
// 					<img
// 						src={"https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
// 						className='h-8 w-8 border rounded-full'
// 						alt=''
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
// export default Card;