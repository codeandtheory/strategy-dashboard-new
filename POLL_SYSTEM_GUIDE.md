# Poll System Guide

## Overview

Each poll has:
1. **Main Ranking Chart** - Generated from poll options (ranks stored in `poll_options` table)
2. **Fun Fact** - Can be text, image, charts, or combinations

## Main Ranking Chart

The main ranking chart is automatically generated from the poll options. To set the rankings:

1. Click the **"Results"** button next to "Total Responses" in the poll list or edit dialog
2. Paste CSV results in format: `Rank,Option Name` or `Option Name,Rank`
3. Click "Save Results" - this updates the poll options with their ranks
4. The ranking chart will be displayed automatically when viewing the poll

### CSV Format Examples:
```
1,Garden State
2,Good Will Hunting
3,Purple Rain
```

Or:
```
Garden State,1
Good Will Hunting,2
Purple Rain,3
```

## Fun Facts

Fun facts support multiple formats and can be combined:

### Text Only
```json
["Item 1", "Item 2", "Item 3"]
```

### Single Chart
```json
{
  "type": "binge-shows",
  "data": [
    {"name": "Gossip Girl", "secretsPerSeason": 14, "gaspsPerMinute": 0.42}
  ],
  "metrics": [
    {"key": "secretsPerSeason", "label": "Secrets", "icon": "lock", "format": "number"}
  ]
}
```

### Multiple Charts (Text + Image + Charts)
```json
{
  "charts": [
    {
      "type": "text",
      "title": "Fun Fact: Statistically speaking...",
      "text": ["turkey", "custard", "caramel"]
    },
    {
      "type": "image",
      "title": "Visualization",
      "imageUrl": "/venn_diagram.png"
    },
    {
      "type": "binge-shows",
      "title": "Detailed Analysis",
      "data": [
        {"name": "Item 1", "metric1": 14, "metric2": 0.42}
      ],
      "metrics": [
        {"key": "metric1", "label": "Metric 1", "icon": "lock", "format": "number"}
      ]
    }
  ]
}
```

## Chart Types

### `text`
Simple text list with optional title.

### `image`
Display an image with optional title.

### `binge-shows`
Infographic-style chart with header stats and item cards (like TV shows example).

### `horizontal-bar`
Simple horizontal bar chart.

### `bar`
Standard bar chart.

### `ranking`
Main ranking chart (automatically generated from poll options).

## Using ChartRenderer Component

The `ChartRenderer` component (`components/charts/chart-renderer.tsx`) can render any of these chart types dynamically:

```tsx
import { ChartRenderer } from '@/components/charts/chart-renderer'

// Single chart
<ChartRenderer config={{
  type: 'binge-shows',
  data: [...],
  metrics: [...]
}} />

// Multiple charts
<ChartRenderer config={{
  charts: [
    { type: 'text', text: ['Item 1', 'Item 2'] },
    { type: 'image', imageUrl: '/chart.png' },
    { type: 'binge-shows', data: [...], metrics: [...] }
  ]
}} />
```

## Workflow

1. **Create Poll** - Add title, question, date, asked by, etc.
2. **Add Options** - Use "Options" button or CSV paste to add poll options
3. **Set Results** - Use "Results" button to paste final rankings CSV
4. **Add Fun Fact** - Add text, image, or charts as fun fact
5. **Save** - Poll is ready to display with main ranking chart + fun fact

