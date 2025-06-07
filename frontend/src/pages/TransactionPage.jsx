import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_TRANSACTION, GET_TRANSACTIONS, GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
import { UPDATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import TransactionFormSkeleton from "../components/skeletons/TransactionFormSkeleton";
import toast from "react-hot-toast";

const TransactionPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		description: "",
		paymentType: "",
		category: "",
		amount: "",
		location: "",
		date: "",
	});

	const { data, loading: queryLoading, error: queryError } = useQuery(GET_TRANSACTION, {
		variables: { id },
		onCompleted: (data) => {
			if (data?.transaction) {
				// Format date for input field (YYYY-MM-DD)
				const date = new Date(data.transaction.date);
				const formattedDate = date.toISOString().split('T')[0];
				
				setFormData({
					description: data.transaction.description,
					paymentType: data.transaction.paymentType,
					category: data.transaction.category,
					amount: data.transaction.amount,
					location: data.transaction.location || "",
					date: formattedDate,
				});
			}
		}
	});

	const [updateTransaction, { loading: mutationLoading }] = useMutation(UPDATE_TRANSACTION, {
		refetchQueries: [
			{ query: GET_TRANSACTIONS },
			{ query: GET_TRANSACTION_STATISTICS }
		],
		onCompleted: () => {
			toast.success("Transaction updated successfully");
			navigate("/");
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateTransaction({
				variables: {
					input: {
						transactionId: id,
						description: formData.description,
						paymentType: formData.paymentType,
						category: formData.category,
						amount: parseFloat(formData.amount),
						location: formData.location,
						date: formData.date,
					}
				}
			});
		} catch (error) {
			// Error is handled in onError callback
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	if (queryLoading) return <TransactionFormSkeleton />;
	
	if (queryError) return (
		<div className="h-screen flex justify-center items-center">
			<p className="text-2xl font-bold text-red-500">Error loading transaction: {queryError.message}</p>
		</div>
	);

	return (
		<div className='h-screen max-w-4xl mx-auto flex flex-col items-center'>
			<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
				Update this transaction
			</p>
			<form className='w-full max-w-lg flex flex-col gap-5 px-3 ' onSubmit={handleSubmit}>
				{/* TRANSACTION */}
				<div className='flex flex-wrap'>
					<div className='w-full'>
						<label
							className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
							htmlFor='description'
						>
							Transaction
						</label>
						<input
							className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
							id='description'
							name='description'
							type='text'
							placeholder='Rent, Groceries, Salary, etc.'
							value={formData.description}
							onChange={handleInputChange}
							required
						/>
					</div>
				</div>
				{/* PAYMENT TYPE */}
				<div className='flex flex-wrap gap-3'>
					<div className='w-full flex-1 mb-6 md:mb-0'>
						<label
							className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
							htmlFor='paymentType'
						>
							Payment Type
						</label>
						<div className='relative'>
							<select
								className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
								id='paymentType'
								name='paymentType'
								onChange={handleInputChange}
								value={formData.paymentType}
								required
							>
								<option value={"card"}>Card</option>
								<option value={"cash"}>Cash</option>
							</select>
							<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
								<svg
									className='fill-current h-4 w-4'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
								>
									<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
								</svg>
							</div>
						</div>
					</div>

					{/* CATEGORY */}
					<div className='w-full flex-1 mb-6 md:mb-0'>
						<label
							className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
							htmlFor='category'
						>
							Category
						</label>
						<div className='relative'>
							<select
								className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
								id='category'
								name='category'
								onChange={handleInputChange}
								value={formData.category}
								required
							>
								<option value={"saving"}>Saving</option>
								<option value={"expense"}>Expense</option>
								<option value={"investment"}>Investment</option>
							</select>
							<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
								<svg
									className='fill-current h-4 w-4'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
								>
									<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
								</svg>
							</div>
						</div>
					</div>

					{/* AMOUNT */}
					<div className='w-full flex-1 mb-6 md:mb-0'>
						<label className='block uppercase text-white text-xs font-bold mb-2' htmlFor='amount'>
							Amount($)
						</label>
						<input
							className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
							id='amount'
							name='amount'
							type='number'
							placeholder='150'
							value={formData.amount}
							onChange={handleInputChange}
							required
						/>
					</div>
				</div>

				{/* LOCATION */}
				<div className='flex flex-wrap gap-3'>
					<div className='w-full flex-1 mb-6 md:mb-0'>
						<label
							className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
							htmlFor='location'
						>
							Location
						</label>
						<input
							className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
							id='location'
							name='location'
							type='text'
							placeholder='New York'
							value={formData.location}
							onChange={handleInputChange}
						/>
					</div>

					{/* DATE */}
					<div className='w-full flex-1'>
						<label
							className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
							htmlFor='date'
						>
							Date
						</label>
						<input
							type='date'
							name='date'
							id='date'
							className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
							placeholder='Select date'
							value={formData.date}
							onChange={handleInputChange}
							required
						/>
					</div>
				</div>
				{/* SUBMIT BUTTON */}
				<button
					className='text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br
          from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600
          disabled:opacity-70 disabled:cursor-not-allowed'
					type='submit'
					disabled={mutationLoading}
				>
					{mutationLoading ? "Updating..." : "Update Transaction"}
				</button>
			</form>
		</div>
	);
};
export default TransactionPage;