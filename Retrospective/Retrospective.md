TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 
- Total points committed vs. done 
- Nr of hours planned vs. spent (as a team)

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _Uncategorized_   |   5      |   0     |    4d4h        |    	4d4h           |
|    GetTiket   |     5    |    3    |   1d2h         |        1d4h5m      |
|   Call Customer    |     5    |  3      |    1d        |       7h       |
|    Next Customer   |    4     |   5     |      6h      |      6h        |  

> story `Uncategorized` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

|            | Mean | StDev |
|------------|------|-------|
| Estimation |   3,2   |     2.76   | 
| Actual     |    3,39  |    3.81  |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 =0,05$$


    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| = 0,18 $$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated = 6
  - Total hours spent = 2
  - Nr of automated unit test cases = 0
  - Coverage = 0
- E2E testing:
  - Total hours estimated = 0
  - Total hours spent = 0
  - Nr of test cases = 0
- Code review 
  - Total hours estimated = 0 
  - Total hours spent = 0
  

## ASSESSMENT

- What did go wrong in the sprint?
  We didn't define a working strategy, or some ticket management method. 
  - We worked without any type of comunication about implementation. We should use a better cooperation.

- What caused your errors in estimation (if any) 
  - The inability to fully understand what our capabilities were.

- What lessons did you learn (both positive and negative) in this sprint?
  - We shoud use better cominication method and define a working strategy. Also for all that concern tickets.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - We don't know yet.
  
- Which ones you were not able to achieve? Why?
  - Define a common implementation strategy due to the knowledge gap in our team

