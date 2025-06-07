// import { useQuery } from "@apollo/client";
// import Card from "./Card";
// import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";

// const Cards = () => {
// 	const { data, loading, error } = useQuery(GET_TRANSACTIONS);
	
// 	if (loading) return (
// 		<div className="w-full px-10 min-h-[40vh] flex justify-center items-center">
// 			<div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
// 		</div>
// 	);
	
// 	if (error) return (
// 		<div className="w-full px-10 min-h-[40vh] flex justify-center items-center">
// 			<p className="text-2xl font-bold text-red-500">Error loading transactions: {error.message}</p>
// 		</div>
// 	);
	
// 	return (
// 		<div className='w-full px-10 min-h-[40vh]'>
// 			<p className='text-5xl font-bold text-center my-10'>History</p>
// 			<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
// 				{data?.transactions.map(transaction => (
// 					<Card key={transaction._id} transaction={transaction} />
// 				))}
// 			</div>
// 			{data?.transactions?.length === 0 && (
// 				<p className='text-2xl font-bold text-center w-full'>No transaction history found.</p>
// 			)}
// 		</div>
// 	);
// };
// export default Cards;