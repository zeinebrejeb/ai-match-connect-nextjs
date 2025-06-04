
import React from "react"; 
import {Search,FileText,Check} from "lucide-react"; 

const Features = () => {

  const features = [
      {
        icon: <FileText className="h-6 w-6" />,
        title: "Smart CV Analysis",
        description:
          "Our AI analyzes your resume to extract skills, experience, and qualifications automatically.",
        
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      },
      {
        icon: <Search className="h-6 w-6" />,
        title: "AI-Powered Matching",
        description:
          "Advanced algorithms match candidates with jobs based on skills, experience, and cultural fit.",
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      },
     
  ];


  return (
    <div className="bg-background py-16 sm:py-24"> {/* Use theme background */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Standard container */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl"> {/* Use theme foreground */}
            How Our AI Platform Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground"> {/* Use theme muted foreground */}
            Our advanced AI algorithms match candidates with the perfect jobs and
            help recruiters find the ideal talent for their openings.
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                
                className="relative p-6 bg-card text-card-foreground rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                 
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-md ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-foreground"> {/* Use theme foreground */}
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-4 text-base text-muted-foreground"> {/* Use theme muted foreground */}
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        
        <div className="mt-20">
           {/* Adjusted background for better theme consistency */}
          <div className="bg-muted/50 dark:bg-card rounded-2xl p-8 md:p-12 border">
            <h3 className="text-2xl font-bold text-foreground mb-6"> {/* Use theme foreground */}
              Why Choose AIMatch?
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Using text-primary for checkmark color */}
              <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0"><Check className="h-6 w-6 text-primary" /></div>
                  <div><h4 className="font-medium text-foreground">Intelligent Matching</h4><p className="mt-1 text-muted-foreground">Our AI understands the nuances...</p></div>
              </div>
              <div className="flex items-start space-x-3">
                 <div className="flex-shrink-0"><Check className="h-6 w-6 text-primary" /></div>
                 <div><h4 className="font-medium text-foreground">Time Saving</h4><p className="mt-1 text-muted-foreground">Automated matching saves hours...</p></div>
              </div>
              <div className="flex items-start space-x-3">
                 <div className="flex-shrink-0"><Check className="h-6 w-6 text-primary" /></div>
                 <div><h4 className="font-medium text-foreground">Higher Quality Matches</h4><p className="mt-1 text-muted-foreground">Focus on candidates and jobs...</p></div>
              </div>
               <div className="flex items-start space-x-3">
                 <div className="flex-shrink-0"><Check className="h-6 w-6 text-primary" /></div>
                 <div><h4 className="font-medium text-foreground">Better Hiring Decisions</h4><p className="mt-1 text-muted-foreground">Data-driven insights help...</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;