# Lessons Learned

## User Experience (UI/UX)

- **Input Sizing**: `box-sizing: border-box` is mandatory for mobile layouts. Without it, `width: 100% + padding` causes overflow.
- **Data Feedback**: "Empty" vs "Zero" must be visually distinct. Use explicit placeholders (e.g., `--°C`) for null values.
- **Desktop Nuances**: `input[type=number]` catches mouse wheel events, changing values unintentionally. Add `onWheel={(e) => e.target.blur()}` to prevent this "scroll trap".
- **Placeholder Visibility**: Default placeholders can look like filled values. Decrease opacity or change color (e.g., `#a0aec0`) to clearly indicate "this is an example".

## Database & Security

- **RLS Policy**: When using RLS, every `INSERT` must explicitly include the `user_id` if the policy checks `auth.uid() = user_id`. The client must "sign" the new row.
- **Supabase Auth**: Google OAuth requires extensive external setup (GCP Console). A step-by-step guide (`GOOGLE_SETUP.md`) is critical for user success.

## Feature Implementation

- **Weather Icons**: Ensure all enum values (e.g., 'Windy') have corresponding UI representations. Missing cases look like bugs.
