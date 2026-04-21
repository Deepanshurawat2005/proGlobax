import { useAppStore } from '@/store/useAppStore';
import { X, Globe2, LineChart, Briefcase, FileText, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MapVisualization } from './MapVisualization';
import { OpportunitiesTab } from './OpportunitiesTab';
import { AddItemForm } from './AddItemForm';

// interface TabContainerProps {
//   appliedTheme: 'light' | 'dark';
// }

// export function TabContainer({ appliedTheme }: TabContainerProps) {
//   const { tabs, activeTabId, setActiveTab, removeTab } = useAppStore();

//   const renderTabContent = () => {
//     const activeTab = tabs.find(t => t.id === activeTabId);
//     if (!activeTab) {
//       return (
//         <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground w-full h-full bg-background/50">
//           <Globe2 className="w-16 h-16 mb-4 opacity-20" />
//           <p>No tabs open</p>
//         </div>
//       );
//     }

//     // Dynamic rendering based on content type
//     switch (activeTab.contentType) {
//       case 'map':
//         return <MapVisualization theme={appliedTheme} />;
      
//       case 'market_opportunity':
//         return (
//           <div className="flex-1 p-8 overflow-y-auto bg-background/50 relative">
//             <div className="max-w-4xl mx-auto space-y-6">
//               <div className="flex items-center space-x-3 mb-8">
//                 <div className="p-2.5 bg-primary/10 rounded-lg">
//                   <LineChart className="w-6 h-6 text-primary" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold tracking-tight">{activeTab.title}</h2>
//                   <p className="text-muted-foreground text-sm">AI-driven analysis of emerging market trends.</p>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="col-span-2 bg-card border rounded-xl p-6 shadow-sm min-h-[300px] flex items-center justify-center">
//                   <span className="text-muted-foreground/50 text-sm">Revenue Forecast Chart Area</span>
//                 </div>
//                 <div className="space-y-6">
//                   <div className="bg-card border rounded-xl p-5 shadow-sm">
//                     <h3 className="font-semibold text-sm mb-3">Key Recommendations</h3>
//                     <ul className="space-y-2 text-sm text-muted-foreground">
//                       <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"/> Expand into SE Asia</li>
//                       <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"/> Diversify raw material suppliers</li>
//                       <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"/> Leverage FTAs in Q3</li>
//                     </ul>
//                   </div>
//                   <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
//                      <SparklesIcon />
//                      <h3 className="font-semibold text-sm mb-1 text-foreground">AI Insight</h3>
//                      <p className="text-xs text-muted-foreground">Tariff reductions in Vietnam align perfectly with your manufacturing vertical.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
        
//       case 'negotiation':
//         return (
//           <div className="flex-1 p-8 overflow-y-auto bg-background/50">
//              <div className="max-w-3xl mx-auto space-y-6">
//                  <div className="flex items-center space-x-3 mb-8">
//                     <div className="p-2.5 bg-primary/10 rounded-lg">
//                       <Briefcase className="w-6 h-6 text-primary" />
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold tracking-tight">Active Negotiations</h2>
//                     </div>
//                   </div>
//                  <div className="bg-card border rounded-xl shadow-sm divide-y">
//                      {[1,2,3].map(i => (
//                          <div key={i} className="p-5 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
//                              <div className="flex items-center gap-4">
//                                 <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
//                                     <FileText className="w-5 h-5 text-muted-foreground" />
//                                 </div>
//                                 <div>
//                                     <div className="text-sm font-medium">Supplier Agreement #{1004 + i}</div>
//                                     <div className="text-xs text-muted-foreground">Pending counter-offer • Updated 2h ago</div>
//                                 </div>
//                              </div>
//                              <div className="text-sm text-primary font-medium">Review</div>
//                          </div>
//                      ))}
//                  </div>
//              </div>
//           </div>
//         )

//       case 'opportunities':
//         return <OpportunitiesTab />;

//       case 'add_item':
//         return <AddItemForm />;

//       default:
//         return (
//           <div className="flex-1 flex flex-col items-center justify-center w-full h-full text-muted-foreground bg-background/50">
//             <h2 className="text-xl font-semibold mb-2 text-foreground">{activeTab.title}</h2>
//             <p className="text-sm">Content component not mapped yet.</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative z-10">
//       {/* Sleek Dark Toolbar */}
//       <div className="h-12 border-b border-border/50 bg-card flex items-center px-4 overflow-x-auto scollbar-hide no-scrollbar w-full shrink-0 gap-2 shadow-sm">
        
//         {/* Navigation Controls */}
  

//         {/* Tab Pills */}
//         <div className="flex items-center h-full min-w-max gap-2">
//           {tabs.map((tab) => (
//             <div
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={cn(
//                 "group flex items-center h-8 px-3 cursor-pointer select-none transition-all rounded-md border text-sm max-w-[200px]",
//                 activeTabId === tab.id 
//                   ? "bg-secondary text-foreground border-border/80 shadow-inner" 
//                   : "bg-transparent text-muted-foreground border-transparent hover:bg-white/5 hover:text-foreground"
//               )}
//             >
//               {activeTabId === tab.id && (
//                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
//               )}
//               <span className="truncate font-medium flex-1 mr-1">
//                 {tab.title}
//               </span>
              
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground ml-1"><path d="m6 9 6 6 6-6"/></svg>

//               {tab.isClosable && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     removeTab(tab.id);
//                   }}
//                   className={cn(
//                     "ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all shrink-0",
//                   )}
//                 >
//                   <X className="w-3.5 h-3.5" />
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Window Render Area */}
//       <div className="flex-1 overflow-hidden relative flex">
//         {renderTabContent()}
//       </div>
//     </div>
//   );
// }

// function SparklesIcon() {
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles absolute -right-4 -top-4 w-16 h-16 text-primary/10 rotate-12"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
//     )
// }




interface TabContainerProps {
  appliedTheme: 'light' | 'dark';
}

export function TabContainer({ appliedTheme }: TabContainerProps) {
  const { tabs, activeTabId, setActiveTab, removeTab } = useAppStore();

  const renderTabContent = () => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground w-full h-full bg-background/50">
          <Globe2 className="w-16 h-16 mb-4 opacity-20" />
          <p>No tabs open</p>
        </div>
      );
    }

    switch (activeTab.contentType) {
      case 'map':
        return <MapVisualization theme={appliedTheme} />;
      
      case 'market_opportunity':
        return (
          <div className="flex-1 p-8 overflow-y-auto bg-background/50 relative">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <LineChart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{activeTab.title}</h2>
                  <p className="text-muted-foreground text-sm">
                    AI-driven analysis of emerging market trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'negotiation':
        return (
          <div className="flex-1 p-8 overflow-y-auto bg-background/50">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Active Negotiations
                </h2>
              </div>
            </div>
          </div>
        );

      case 'opportunities':
        return <OpportunitiesTab />;

      case 'add_item':
        return <AddItemForm />;

      case 'compliance_details':
        return (
          <div className="flex-1 overflow-y-auto bg-background/50">
            <div className="max-w-2xl mx-auto p-8 space-y-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{activeTab.title}</h2>
                  <p className="text-muted-foreground text-sm">Detailed compliance analysis and requirements</p>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
                {activeTab.data?.compliance_status && (
                  <div className="flex items-center gap-3 pb-4 border-b border-border/30">
                    <div className={`w-3 h-3 rounded-full ${
                      activeTab.data.compliance_status === 'fully_compliant' ? 'bg-green-500' :
                      activeTab.data.compliance_status === 'easy' ? 'bg-yellow-500' :
                      activeTab.data.compliance_status === 'moderate' ? 'bg-orange-500' :
                      activeTab.data.compliance_status === 'risky' ? 'bg-red-500' :
                      activeTab.data.compliance_status === 'strict' ? 'bg-red-900' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-sm font-semibold text-foreground capitalize">
                      {activeTab.data.compliance_status.replace('_', ' ')} Compliance
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Compliance Analysis</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {activeTab.data?.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'opportunity_details':
        return (
          <div className="flex-1 overflow-y-auto bg-background/50">
            <div className="max-w-2xl mx-auto p-8 space-y-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <LineChart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{activeTab.title}</h2>
                  <p className="text-muted-foreground text-sm">Market opportunity details and analysis</p>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
                {activeTab.data?.type && (
                  <div className="flex items-center gap-3 pb-4 border-b border-border/30">
                    <div className={`w-2 h-2 rounded-full ${
                      activeTab.data.type === 'demand' ? 'bg-orange-400' :
                      activeTab.data.type === 'supply' ? 'bg-blue-400' :
                      activeTab.data.type === 'trending' ? 'bg-yellow-400' :
                      activeTab.data.type === 'risk' ? 'bg-red-400' :
                      activeTab.data.type === 'hub' ? 'bg-green-400' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-sm font-semibold text-foreground uppercase">
                      {activeTab.data.type}
                    </span>
                  </div>
                )}

                {activeTab.data?.country && (
                  <div className="flex items-center gap-2 pb-3 border-b border-border/30">
                    <MapPin className="w-4 h-4 text-primary/60" />
                    <span className="text-sm font-medium text-foreground">{activeTab.data.country}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Opportunity Details</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {activeTab.data?.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center w-full h-full text-muted-foreground bg-background/50">
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              {activeTab.title}
            </h2>
            <p className="text-sm">Content component not mapped yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative z-10">

      {/* Toolbar */}
      <div className="h-12 border-b border-border/50 bg-card flex items-center px-4 overflow-x-auto w-full shrink-0 gap-2 shadow-sm">
        
        {/* Tabs */}
        <div className="flex items-center h-full min-w-max gap-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group flex items-center h-8 px-3 cursor-pointer select-none transition-all rounded-md border text-sm max-w-[200px]",
                activeTabId === tab.id 
                  ? "bg-secondary text-foreground border-border/80 shadow-inner" 
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-white/5 hover:text-foreground"
              )}
            >
              {activeTabId === tab.id && (
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              )}

              {/* ✅ TITLE ONLY (ARROW REMOVED) */}
              <span className="truncate font-medium flex-1 mr-1">
                {tab.title}
              </span>

              {tab.isClosable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                  className="ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative flex">
        {renderTabContent()}
      </div>
    </div>
  );
}