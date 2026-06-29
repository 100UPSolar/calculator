# UP Tools — WordPress Plugin

Brighter Websites | Built for 100UP

---

## File Structure

```
up-tools/
├── up-tools.php                        ← Plugin entry point + registry
├── assets/
│   ├── up-solar-optimiser.css          ← Tool styles (scoped to #up-offgrid-calc)
│   └── up-solar-optimiser.js           ← Tool logic
└── templates/
    └── up-solar-optimiser.php          ← HTML structure (no style/script tags)
```

---

## Installation

1. Upload the `up-tools` folder to `/wp-content/plugins/`
2. Activate via Plugins > Installed Plugins
3. Add `[up_solar_optimiser]` shortcode to any page
4. Assets load only on pages that use the shortcode

---

## LiteSpeed Cache — Required Setting

To prevent LiteSpeed from minifying or deferring UP tool scripts:

**LiteSpeed Cache > Page Optimization > JS Settings > JS Excludes**

Add:
```
up-
```

This single prefix exclusion covers all current and future UP tools (`up-solar-optimiser.js`, `up-power-sizer.js`, etc).

---

## Adding a New Tool

1. Create `assets/up-toolname.css`
2. Create `assets/up-toolname.js`
3. Create `templates/up-toolname.php`
4. Register in `up-tools.php` inside `up_tools_registry()`:

```php
'up_toolname' => 'up-toolname',
```

5. Use shortcode `[up_toolname]` on any page

---

## Shortcode Reference

| Shortcode              | Page                  |
|------------------------|-----------------------|
| `[up_solar_optimiser]` | Private optimiser tool|

---

## Notes

- All JS filenames prefixed `up-` — one LS exclusion rule covers everything
- CSS scoped to tool wrapper ID — safe alongside any theme
- JS loads in footer, waits for DOM — no race conditions
- No tool output is printed unless the shortcode is on the page
