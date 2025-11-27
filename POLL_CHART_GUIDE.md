# Poll Chart Guide

This guide explains how to dynamically generate charts for poll fun facts, similar to the "binge TV shows" chart.

## Chart Component

The `PollChart` component (`components/poll-chart.tsx`) can render different chart types based on JSON data stored in `fun_fact_content`.

## Chart Types

### 1. Binge Shows Style (`binge-shows`)

This creates the infographic-style chart like the TV shows example, with header stats and item cards.

**JSON Structure:**
```json
{
  "type": "binge-shows",
  "data": [
    {
      "name": "Gossip Girl",
      "secretsPerSeason": 14,
      "gaspsPerMinute": 0.42,
      "percentChangeNothing": 72
    },
    {
      "name": "Pretty Little Liars",
      "secretsPerSeason": 18,
      "gaspsPerMinute": 0.55,
      "percentChangeNothing": 81
    }
  ],
  "metrics": [
    {
      "key": "secretsPerSeason",
      "label": "Secrets",
      "icon": "lock",
      "format": "number"
    },
    {
      "key": "gaspsPerMinute",
      "label": "Gasps",
      "icon": "zap",
      "format": "decimal"
    },
    {
      "key": "percentChangeNothing",
      "label": "Change",
      "icon": "trending",
      "format": "percentage"
    }
  ],
  "accentColor": "#FF4C4C"
}
```

**Metrics Configuration:**
- `key`: The property name in the data objects
- `label`: Display label for the metric
- `icon`: One of `"lock"`, `"trending"`, `"zap"`, or omit for no icon
- `format`: `"number"`, `"percentage"`, or `"decimal"`

### 2. Horizontal Bar Chart (`horizontal-bar`)

Simple horizontal bar chart.

**JSON Structure:**
```json
{
  "type": "horizontal-bar",
  "data": [
    { "name": "Option 1", "value": 10 },
    { "name": "Option 2", "value": 20 },
    { "name": "Option 3", "value": 15 }
  ],
  "metrics": [
    { "key": "value", "label": "Count" }
  ],
  "accentColor": "#FF4C4C"
}
```

## Using in Vibes Page

To display the chart in the poll dialog, add this to `app/vibes/page.tsx`:

```tsx
import { PollChart } from '@/components/poll-chart'

// In the poll dialog, where fun facts are displayed:
{selectedPoll.fun_fact_content && selectedPoll.fun_fact_title && (
  <div className="my-8 pt-8 border-t" style={{ borderColor: mode === 'chaos' ? 'rgba(255, 255, 255, 0.1)' : mode === 'chill' ? 'rgba(74, 24, 24, 0.1)' : 'rgba(255, 255, 255, 0.1)' }}>
    <h4 className={`text-xl font-black mb-4 ${getTextClass()}`}>
      {selectedPoll.fun_fact_title}
    </h4>
    
    {(() => {
      try {
        const content = typeof selectedPoll.fun_fact_content === 'string' 
          ? JSON.parse(selectedPoll.fun_fact_content)
          : selectedPoll.fun_fact_content
        
        // Check if it's a chart (has type property)
        if (content && typeof content === 'object' && content.type) {
          return <PollChart chartData={content} />
        }
        
        // Otherwise, render as text list
        const items = Array.isArray(content) ? content : []
        return (
          <ul className={`space-y-1 text-base ${getTextClass()} opacity-70`}>
            {items.map((item: string, idx: number) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        )
      } catch (e) {
        return (
          <p className={`text-base ${getTextClass()} opacity-70`}>
            {selectedPoll.fun_fact_content}
          </p>
        )
      }
    })()}
  </div>
)}
```

## Creating Charts in Admin

1. Go to Admin > Channel Polls
2. Create or edit a poll
3. Set "Fun Fact Type" to "Chart"
4. Enter JSON in the format shown above
5. Use the example in the expandable details section as a template

## Tips

- The `accentColor` is optional - defaults to `#FF4C4C` (red system primary)
- For binge-shows style, you can have up to 3 metrics displayed in the header
- Metrics are displayed in order, so put the most important first
- The chart automatically calculates max values and percentages
- Top items get highlighted with the accent color

