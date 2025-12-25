import { useState, useEffect } from 'react';
import { getStudentFees } from '@/actions/studentFees';
import useSchoolStore from '@/store/school';

export interface StudentFee {
    id: string;
    studentId: string;
    studentName: string;
    studentFirstName?: string;
    studentLastName?: string;
    className: string;
    classSection?: string; // e.g., "A", "B"
    feeType: string;
    feeId?: string;
    academicYearId?: string;
    amount: number;
    paidAmount?: number;
    remainingAmount?: number;
    dueDate: string;
    paidDate?: string;
    status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
    receiptNo?: string;
    paymentMethod?: string;
    signature?: string;
    notes?: string;
    schoolLogo?: string; // School logo URL
}

export function useStudentFees() {
    const [fees, setFees] = useState<StudentFee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { school } = useSchoolStore();

    useEffect(() => {
        const fetchFees = async () => {
            if (!school?.id) {
                console.log("No school ID found, skipping fee fetch");
                setLoading(false);
                return;
            }

            setLoading(true);
            console.log("Fetching student fees for school:", school.id);

            try {
                const studentFeeStructures = await getStudentFees({ 
                    schoolId: school.id 
                });
                
                console.log("Received student fee structures:", studentFeeStructures);
                
                // Validate response
                if (!studentFeeStructures || !Array.isArray(studentFeeStructures)) {
                    console.warn('Invalid response from getStudentFees:', studentFeeStructures);
                    setFees([]);
                    setLoading(false);
                    return;
                }
                
                console.log(`Processing ${studentFeeStructures.length} fee structures`);
                
                // Transform StudentFeeStructure to StudentFee format
                const transformedFees: StudentFee[] = studentFeeStructures.map((sfs: any) => {
                    const paidAmount = sfs.paidAmount || 0;
                    const totalAmount = sfs.totalAmount;
                    const remainingAmount = sfs.outstandingAmount || (totalAmount - paidAmount);
                    
                    // Calculate status
                    let status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL' = sfs.status as any;
                    
                    if (!status) {
                        if (paidAmount >= totalAmount) {
                            status = 'PAID';
                        } else if (paidAmount > 0) {
                            status = 'PARTIAL';
                        } else {
                            status = 'PENDING';
                        }
                    }

                    // Get the most recent payment for paidDate and receiptNo
                    const lastPayment = sfs.payments && sfs.payments.length > 0 
                        ? sfs.payments[sfs.payments.length - 1] 
                        : null;

                    // Build full class name with section (e.g., "6ème A")
                    const classTitle = sfs.student?.class?.title || 'N/A';
                    const sectionName = sfs.student?.class?.section?.name || '';
                    const fullClassName = sectionName ? `${classTitle} ${sectionName}` : classTitle;

                    // Get full student name
                    const firstName = sfs.student?.firstName || '';
                    const lastName = sfs.student?.lastName || '';
                    const fullName = `${lastName} ${firstName}`.trim() || sfs.student?.name || 'Unknown';

                    return {
                        id: sfs.id,
                        studentId: sfs.studentId,
                        studentName: fullName,
                        studentFirstName: firstName,
                        studentLastName: lastName,
                        className: classTitle,
                        classSection: sectionName,
                        feeType: sfs.fee?.name || 'Unknown Fee',
                        feeId: sfs.feeId,
                        academicYearId: sfs.academicYearId,
                        amount: totalAmount,
                        paidAmount,
                        remainingAmount,
                        dueDate: sfs.dueDate || sfs.fee?.dueDate || sfs.createdAt,
                        paidDate: lastPayment?.createdAt,
                        status,
                        receiptNo: lastPayment?.receiptNumber,
                        paymentMethod: lastPayment?.method || lastPayment?.paymentMethod,
                        signature: lastPayment?.signature,
                        notes: sfs.notes || sfs.fee?.description,
                        schoolLogo: sfs.student?.school?.logo,
                    };
                });

                console.log(`Successfully transformed ${transformedFees.length} fees`);
                setFees(transformedFees);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An error occurred';
                console.error('=== ERROR FETCHING STUDENT FEES ===');
                console.error('Error type:', err instanceof Error ? 'Error' : typeof err);
                console.error('Error message:', errorMessage);
                console.error('Full error:', err);
                console.error('===================================');
                
                setError(errorMessage);
                setFees([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, [school?.id]);

    return { fees, loading, error };
}
