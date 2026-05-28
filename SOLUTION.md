# Solution

## Bugs found & fixed

### Bug 1: Occupations API data shape mismatch

The backend API at `/api/occupations` responds with an object containing a field of `Occupation[]` and a field with the number of items contained by the first field. The frontend expected only the content of the first field and crashed after receiving the unexpected format. I added a new type in `types/index.ts` to represent the shape of the API response and changed `fetchOccupations()` in `occupations.ts` to use the new type to first unwrap the data field before returning it. This ensures the issue is fixed everywhere `fetchOccupations()` is used rather than the less maintainable and more intrusive approach of attempting to change this behavior in each individual place.

## Feature notes

## Integration notes

## Assumptions

Bug 1: I assumed that the `count` field could either be used by a different frontend client or was intended to be used by future functionality of this client. Therefore, it made more sense to adapt the frontend to the backend's behavior.

## What I'd build next

