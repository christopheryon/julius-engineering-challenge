# Solution

## Bugs found & fixed

### Bug 1: Occupations API data shape mismatch

The backend API at `/api/occupations` responds with an object containing a field of `Occupation[]` and a field with the number of items contained by the first field. The frontend expected only the content of the first field and crashed after receiving the unexpected format. I added a new type in `types/index.ts` to represent the shape of the API response and changed `fetchOccupations()` in `occupations.ts` to use the new type to first unwrap the data field before returning it. This ensures the issue is fixed everywhere `fetchOccupations()` is used rather than the less maintainable and more intrusive approach of attempting to change this behavior in each individual place. I found this bug by inspecting the files reported in the console errors on the first launch of the application.

### Bug 2: Chart does not update when data is changed

While building the sorting and filtering features, I found that the chart does not update when the data passed to it changes. This is because the `useMemo` that defines the data to render did not depend on the `occupations` prop, meaning it was only ever computed once on mount and any changes were ignored. I fixed this by making the useMemo depend on `occupations`.

### Bug 3: State management issue with useFetch hook

The `useFetch` hook did not properly update the loading and error states on subsequent fetches. I noticed this while reading it to properly implement the loading and error states in my trend chart. I confirmed this by both adding an artificial delay to the API route and shutting down the server completely, and observed that the loading state would not show on subsequent trend charts (it would display stale data instead) and errors would not clear when the server came back online without reloading the frontend. I fixed this by properly resetting the loading and error states inside the `useEffect` of `useFetch`. 

## Feature notes

### UI/UX

#### Inline column sorting

The column sorting takes place in the header of each sortable column. This removes clutter from the UI and is consistent with many other implementations of column sorting in software the user is likely familiar with.

### Technical

#### Centralized filter management

For a reasonably-sized set of filters, a centralized filter state ensures readability and consistency when updating/recomputing other state (the filtered data) based on changes in the filter state.

#### State management: centralized useMemo

Rather than attempt to communicate the filter instructions to each component, I used a single instance of `useMemo` to define a centralized `filteredOccupations` state that handles both state updates and recomputations (as opposed to combining `useState` and `useEffect`, for example). This ensures that the sorting and filtering of the data propagates to all components simply by passing the processed data directly to them, avoiding invasive and error-prone changes in each component.

#### Additional types

Defining types for the filters means they can be cleanly reused elsewhere, in addition to letting TypeScript provide consistent guidance on where changes need to be made if filters are added, removed, or edited.

Defining string union types for `SortKey` and `SortDirection` is both more readable than simple numeric flags (such as 0 or 1 for `SortDirection`) and reduces future bugs by making it clear which values are accepted by current implementations.

#### Helper function for sortable headers

In the scope of a single file, building a sortable header in a helper function means the code for the table is cleaner and more readable. Changes to sortable headers will automatically propagate to all places where they're used, and if other tables use them in the future, they can more easily be extracted into their own React component.


## Integration notes

I used an expand-in-place UI pattern for the trend charts. When clicking a row, the occupation name is bolded to show which one was selected and the chart appears underneath. It can be closed by selecting another row, selecting the same row, or clicking the x button in the corner, providing flexibility. I chose this pattern for two main reasons: to preserve context (the user does not have to adjust to a drastic UI shift, and can see the rest of the UI while looking at a trend chart) and allow for quicker comparisons (the user can quickly switch between rows without dismissing a modal that has taken over the entire screen).

## Assumptions

Bug 1: I assumed that the `count` field could either be used by a different frontend client or was intended to be used by future functionality of this client. Therefore, it made more sense to adapt the frontend to the backend's behavior.

Sorting: I assumed initially sorting the table by medium wage would be a sane default. With more time, the safest option would likely be to build an option to clear sorting and/or clear all filters, and to show the table unsorted by default.

## What I'd build next

- Show projected growth in trend charts
- Add views to compare trend charts to each other (multiple side by side, or multiple lines on one)
- Testing: add tests with sample data for sorting and filtering to make it easier to add new filtering options while keeping old behavior consistent
- Accessibility: test keyboard navigation and screen reader experience to spot flaws in how users of accessibility tools experience the client