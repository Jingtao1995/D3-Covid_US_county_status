// https://observablehq.com/@jingtao1995/covid-data@728
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Data Library`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Data from NYT`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`* This is the raw data fetched from covid19-projections`
)});
  main.variable(observer("raw_covid_estimates_latest")).define("raw_covid_estimates_latest", ["d3"], async function(d3){return(
d3.csvParse(
  await (await fetch("https://raw.githubusercontent.com/youyanggu/covid19_projections/master/infection_estimates/latest_all_estimates_states.csv")).text()
)
)});
  main.variable(observer()).define(["md"], function(md){return(
md `* Creating an array list of 51 states' abbreviation and mapping those abbreviation with full name, then filtering those states' data.<br> Note: some states don't have recent covid data, we need to trim those data out`
)});
  main.variable(observer("states_abbr")).define("states_abbr", function(){return(
[
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['District of Columbia', 'DC'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ]
)});
  main.variable(observer("state_abbr_map")).define("state_abbr_map", ["states_abbr"], function(states_abbr){return(
new Map(states_abbr.map(d=>[d[1],d[0]]))
)});
  main.variable(observer("covid_estimates_temp")).define("covid_estimates_temp", ["filtered_covid_estimates","state_abbr_map","reverse_state_id"], function(filtered_covid_estimates,state_abbr_map,reverse_state_id){return(
filtered_covid_estimates.map(d=>({
  date:d.date,
  state:state_abbr_map.get(d.state),
  id:reverse_state_id.get(state_abbr_map.get(d.state)?state_abbr_map.get(d.state).toLowerCase():'undefined'),
  total_cases:d.total_cases,
  total_deaths:d.total_deaths,
  total_tested:d.total_tests,
  daily_positive_7day_avg:d.daily_positive_7day_ma,
  daily_deaths_7day_avg:d.daily_deaths_7day_ma,
  daily_tests_7day_avg:d.daily_tests_7day_ma,
  positive_rate_7day_avg:d.positivity_rate_7day_ma,
  estimate_infection_avg:d.new_infected_mean
}))
)});
  main.variable(observer("covid_estimates_temp_filter")).define("covid_estimates_temp_filter", ["covid_estimates_temp"], function(covid_estimates_temp){return(
covid_estimates_temp.filter(d=>d.state)
)});
  main.variable(observer()).define(["md"], function(md){return(
md `* Filtering raw data to get latest covid forecast data by covid-projects data <br> Then, we reorganize those data by adding the US map topology data`
)});
  main.variable(observer("filtered_covid_estimates")).define("filtered_covid_estimates", ["raw_covid_estimates_latest","yesterday"], function(raw_covid_estimates_latest,yesterday){return(
raw_covid_estimates_latest.filter(d=>d.date == yesterday)
)});
  main.variable(observer("covid_estimates_with_shape")).define("covid_estimates_with_shape", ["covid_estimates_temp_filter","us_state_shape_map"], function(covid_estimates_temp_filter,us_state_shape_map){return(
covid_estimates_temp_filter.map(d=>({
  type:us_state_shape_map.get(d.id).type,
  properties:us_state_shape_map.get(d.id).properties,
  geometry:us_state_shape_map.get(d.id).geometry,
  ...d
}))
)});
  main.variable(observer()).define(["md"], function(md){return(
md `* Fethching data from New York Times, those data contains a series updates from 2020-01-21 which is the time when first case deteced in United States. <br> And then clean those data.`
)});
  main.variable(observer("raw_all_counties_timeline")).define("raw_all_counties_timeline", ["d3"], async function(d3){return(
d3.csvParse(
  await (await fetch(
    "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv"
  )).text()
)
)});
  main.variable(observer("raw_timeline")).define("raw_timeline", ["raw_all_counties_timeline"], function(raw_all_counties_timeline)
{
  let arr = []
  raw_all_counties_timeline.forEach(d=>{
    arr.push({date:d.date,
              state:d.state,
              county:d.county,
              id:d.fips,
              confirmed:parseInt(d.cases),
              death:parseInt(d.deaths)
             })
  })
  return arr
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `* Map geo-territory data from TopoJson package, using those data, we can shape the US states and counties' contour.`
)});
  main.variable(observer("us")).define("us", ["d3"], function(d3){return(
d3.json("https://unpkg.com/us-atlas@3/counties-albers-10m.json")
)});
  main.variable(observer("us_counties_shape")).define("us_counties_shape", ["topojson","us"], function(topojson,us){return(
topojson.feature(us, us.objects.counties).features.sort((a,b) => +a.id - +b.id)
)});
  main.variable(observer("us_states_shape")).define("us_states_shape", ["topojson","us"], function(topojson,us){return(
topojson.feature(us, us.objects.states).features.sort((a,b) => +a.id - +b.id)
)});
  main.variable(observer()).define(["md"], function(md){return(
md `* Mapping state's properties with it's unique id, throughing this, we can merge the covid data with map data`
)});
  main.variable(observer("us_state_shape_map")).define("us_state_shape_map", ["us_states_shape"], function(us_states_shape){return(
new Map(us_states_shape.map(d=>[d.id, d]))
)});
  main.variable(observer("us_states_id")).define("us_states_id", ["us"], function(us){return(
new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))
)});
  main.variable(observer("us_county_id")).define("us_county_id", ["us"], function(us){return(
new Map(us.objects.counties.geometries.map(d => [d.id, d.properties]))
)});
  main.variable(observer("reverse_state_id")).define("reverse_state_id", ["us"], function(us){return(
new Map(us.objects.states.geometries.map(d => [d.properties.name.toLowerCase() , d.id]))
)});
  main.variable(observer()).define(["md"], function(md){return(
md `* Fetching us counties' population statistical data from census.gov and mapping this new info into previous cleaned data.`
)});
  main.variable(observer("fetchPopulation")).define("fetchPopulation", ["d3"], function(d3){return(
function fetchPopulation() {
  return d3.json("https://api.census.gov/data/2019/pep/population?get=POP&for=county:*").then(rows => rows.slice(1).sort((a, b) => d3.ascending(a[1], b[1]) || d3.ascending(a[2], b[2])).map(([population, state, county]) => [state + county, +population]));
}
)});
  main.variable(observer("population_each_county")).define("population_each_county", ["d3","fetchPopulation"], async function(d3,fetchPopulation){return(
Object.assign(new Map(d3.zip(...await Promise.all([11].map(fetchPopulation))).map(([[id2019, population2019]]) => { return [id2019, population2019];
})))
)});
  main.variable(observer("us_counties_shape_with_population")).define("us_counties_shape_with_population", ["us_counties_shape","population_each_county"], function(us_counties_shape,population_each_county){return(
us_counties_shape.map(d=>({...d, population: population_each_county.get(d.id)}))
)});
  main.variable(observer("excludePlaces")).define("excludePlaces", function(){return(
new Set(["Guam", "Puerto Rico", "Virgin Islands", "Northern Mariana Islands"])
)});
  main.variable(observer("nyc_ids")).define("nyc_ids", function(){return(
["36061", "36047", "36081", "36005", "36085"]
)});
  main.variable(observer("startDate")).define("startDate", function(){return(
'2020-02-01'
)});
  main.variable(observer("yesterday")).define("yesterday", ["d3"], function(d3)
{
  let date = new Date()
  let parseDate = d3.timeFormat('%Y-%m-%d')
  let yesterday = new Date(date.getTime() - 15 * 60 * 60 * 24 * 1000)
  return parseDate(yesterday)
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## cleaned data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `* group the cleaned data by time series`
)});
  main.variable(observer("grouped_timeline_data")).define("grouped_timeline_data", ["d3","raw_timeline","excludePlaces","startDate"], function(d3,raw_timeline,excludePlaces,startDate){return(
d3.nest()
  .key(d=>d.date)
  .entries(raw_timeline.filter(d=>!excludePlaces.has(d.state)))
  .map(d=>d.values)
  .filter(d=>d[0].date >= startDate)
)});
  main.variable(observer("date_period")).define("date_period", ["grouped_timeline_data"], function(grouped_timeline_data){return(
grouped_timeline_data.map(d=>d[0].date)
)});
  main.variable(observer()).define(["md"], function(md){return(
md `# Import`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require('topojson-client@3')
)});
  main.variable(observer("back_up_code")).define("back_up_code", function()
{
  // cleaned_realtime_data = {
  //   let arr = []
  //   all_counties_realtime_data.forEach(d=>{
  //     let state = d.province
  //     let county = d.county
  //     let info = [...us_states_id].find(([key,value])=>value === state)
  //     console.log(info)
  //     arr.push({state:d.province, county:d.county, confirmed:d.stats.confirmed, death:d.stats.deaths, recover:d.stats.recovered, update:d.updatedAt})
  //   })
  //   return arr
  // }
  // cleaned_shape_with_data = {
//   let arr = []
//   us_counties_shape.forEach(d=>{
//     let type = d.type
//     let properties = d.properties
//     let info = us_counties_id.get(d.id)
//     let county_id = info.id
//     let state_id = info.state_id
//     let state_name = info.state
//     let county_name = info.county
//     let name = d.properties.name
//     let geometry = d.geometry
//     let temp = cleaned_realtime_data.filter(d=>{return d.state===state_name&&d.county===county_name})
//     if(temp[0])
//       arr.push({type:type, id:info.id, state_id:state_id, state_name:state_name, county_name:county_name, confirmed:temp[0].confirmed, death:temp[0].death, recover:temp[0].recover, properties:properties, geometry:geometry})
//     else
//       arr.push({type:type, id:info.id, state_id:state_id, state_name:state_name, county_name:county_name, confirmed:'Unknown', death:'Unknown', recover:'Unknown', properties:properties, geometry:geometry})
//   })
//   return arr
// }
}
);
  return main;
}
