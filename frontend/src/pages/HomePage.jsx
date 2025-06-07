// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// import Cards from "../components/Cards";
// import TransactionForm from "../components/TransactionForm";

// import { MdLogout } from "react-icons/md";
// import toast from "react-hot-toast";
// import { useMutation, useQuery } from "@apollo/client";
// import { LOGOUT } from "../graphql/mutations/user.mutation";
// import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const HomePage = () => {
// 	const { data: statsData, loading: statsLoading } = useQuery(GET_TRANSACTION_STATISTICS, {
// 		fetchPolicy: "cache-and-network", // This ensures we get fresh data but still show cached data first
// 	});

// 	// Create chart data from the statistics
// 	const chartData = {
// 		labels: ["Saving", "Expense", "Investment"],
// 		datasets: [
// 			{
// 				label: "Amount ($)",
// 				data: statsLoading ? [0, 0, 0] : [
// 					statsData?.categoryStatistics.find(s => s.category === "saving")?.totalAmount || 0,
// 					statsData?.categoryStatistics.find(s => s.category === "expense")?.totalAmount || 0,
// 					statsData?.categoryStatistics.find(s => s.category === "investment")?.totalAmount || 0
// 				],
// 				backgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)"],
// 				borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
// 				borderWidth: 1,
// 				borderRadius: 8,
// 				spacing: 10,
// 				cutout: 130,
// 			},
// 		],
// 	};

// 	// Chart options for better tooltips and appearance
// 	const chartOptions = {
// 		plugins: {
// 			tooltip: {
// 				callbacks: {
// 					label: function(context) {
// 						const label = context.dataset.label || '';
// 						const value = context.parsed || 0;
// 						const total = context.dataset.data.reduce((a, b) => a + b, 0);
// 						const percentage = total > 0 ? Math.round((value * 100) / total) : 0;
// 						return `${label}: $${value} (${percentage}%)`;
// 					}
// 				}
// 			},
// 			legend: {
// 				position: 'bottom',
// 				labels: {
// 					color: 'white',
// 					padding: 20,
// 					font: {
// 						size: 14
// 					}
// 				}
// 			}
// 		}
// 	};

// 	const [logout, { loading }] = useMutation(LOGOUT, {
// 		refetchQueries: ["GetAuthenticatedUser"],
// 	});

// 	const handleLogout = async () => {
// 		try {
// 			await logout();
// 		} catch (error) {
// 			console.error("Error logging out:", error);
// 			toast.error(error.message);
// 		}
// 	};

// 	return (
// 		<>
// 			<div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
// 				<div className='flex items-center'>
// 					<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
// 						Spend wisely, track wisely
// 					</p>
// 					<img
// 						src={"https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
// 						className='w-11 h-11 rounded-full border cursor-pointer'
// 						alt='Avatar'
// 					/>
// 					{!loading && <MdLogout className='mx-2 w-5 h-5 cursor-pointer' onClick={handleLogout} />}
// 					{/* loading spinner */}
// 					{loading && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
// 				</div>
// 				<div className='flex flex-wrap w-full justify-center items-center gap-6'>
// 					<div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]'>
// 						{statsLoading && (
// 							<div className="h-full w-full flex items-center justify-center">
// 								<div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
// 							</div>
// 						)}
// 						{!statsLoading && (
// 							<Doughnut data={chartData} options={chartOptions} />
// 						)}
// 					</div>

// 					<TransactionForm />
// 				</div>
// 				<Cards />
// 			</div>
// 		</>
// 	);
// };
// export default HomePage;