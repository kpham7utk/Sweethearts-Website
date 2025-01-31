import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import RegistrationForm from './RegistrationForm';

interface ClassData {
  id: number;
  title: string;
  description: string;
  price: number;
  max_spots: number;
  duration: number;
  date: string;
  time: string;
  spots_remaining: number;
  is_active: boolean;
}

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  participants: number;
  specialRequirements?: string;
}

const CakeClassCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'initial' | 'form' | 'complete'>('initial');
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([]);

  // Fetch classes when component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/test-db');
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleClassSelect = (classData: ClassData) => {
    setSelectedClass(classData);
    setRegistrationStep('initial');
  };

  const handleRegistration = async (formData: RegistrationData) => {
    console.log('Registration data:', { class: selectedClass, form: formData });
    setRegistrationStep('complete');
    setShowSuccessAlert(true);
    setDialogOpen(false);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getClassesForDay = (date: Date): ClassData[] => {
    return classes.filter(cls => {
      const classDate = new Date(cls.date);
      return format(classDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-playfair font-bold mb-2">Cake Making Classes</h2>
        <p className="text-gray-600">Join our expert bakers and learn the art of cake making</p>
      </div>

      {showSuccessAlert && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">Registration Successful!</p>
          <p className="text-sm">You&apos;re all set! Check your email for confirmation details.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-playfair font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {getDaysInMonth().map((day, idx) => {
          const classes = getClassesForDay(day);
          const hasClass = classes.length > 0;
          
          return (
            <div
              key={idx}
              className={`
                p-4 border rounded-lg min-h-[80px] relative
                ${!isSameMonth(day, currentDate) ? 'bg-gray-50' : 'bg-white'}
                ${isToday(day) ? 'border-pink-300' : 'border-gray-200'}
              `}
            >
              <span className="text-right block w-full mb-2">
                {format(day, 'd')}
              </span>
              
              {hasClass && classes.map(cls => (
                <Dialog 
                  key={cls.id}
                  open={dialogOpen && selectedClass?.id === cls.id}
                  onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (open) {
                      handleClassSelect(cls);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <button
                      className="w-full text-left p-2 text-sm bg-pink-50 text-pink-700 
                               rounded hover:bg-pink-100 transition-colors"
                    >
                      {cls.title}
                    </button>
                  </DialogTrigger>
                  
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-playfair">{cls.title}</DialogTitle>
                    </DialogHeader>
                    
                    {registrationStep === 'initial' ? (
                      <div className="mt-4">
                        <p className="text-gray-600 mb-4">{cls.description}</p>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Date:</span> {format(new Date(cls.date), 'MMMM d, yyyy')}</p>
                          <p><span className="font-medium">Time:</span> {cls.time}</p>
                          <p><span className="font-medium">Duration:</span> {cls.duration / 60} hours</p>
                          <p><span className="font-medium">Available Spots:</span> {cls.spots_remaining}</p>
                          <p><span className="font-medium">Price:</span> ${cls.price}</p>
                        </div>
                        
                        <button
                          onClick={() => setRegistrationStep('form')}
                          className="mt-6 w-full bg-pink-600 text-white py-2 px-4 rounded 
                                   hover:bg-pink-700 transition-colors font-medium"
                        >
                          Register for Class
                        </button>
                      </div>
                    ) : (
                      <RegistrationForm
                        classData={cls}
                        onSubmit={handleRegistration}
                        onCancel={() => setRegistrationStep('initial')}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CakeClassCalendar;