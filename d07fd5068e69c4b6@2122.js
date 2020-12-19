import define1 from "./56e619316da39da1@728.js";
import define2 from "./e93997d5089d7165@2286.js";
import define3 from "./450051d7f1174df8@252.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# CS 5891 Project Prototype`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## US Covid-19 Cases of Counties
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
Some Ideas derived from paulchaikin's prototype, https://observablehq.com/@pamacha/covid-19-cases-by-county
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`##  Background
Coronavirus continues to shape our world and influence our representation as inhabitants of the planet itself since January 2020. In many parts of the world, cases of COVID-19 are declining, while other areas are seeing spikes, espicially in US. The coronavirus is leaving its mark on daily life across America, with the number of new cases climbing in nearly every state.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`##  Objectives

In our project, we want to look at this coronavirus pandemic across the United states through our visual encodings and interactions. We will mark different areas by daily new cases or new death cases and make prediction about future development of the epidemic. We hope our visualization may attract people's attention in high-risk areas, have better guidance for outdoor activity options and may have better instructions for local authorities.

Our visualization want to answer:

* In diffenent counties of THe United States, how is it going from the begining till now? What is the possible development in this area? 

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Graph`
)});
  main.variable(observer("viewof option1")).define("viewof option1", ["radio"], function(radio){return(
radio({
  options: [ 
    { label: 'timeline', value: 'timeline'},
    { label: 'plain canvas', value: 'canvas' }, 
    { label: 'next week daily average infection prediction', value: 'prediction' }
  ],
  value: 'timeline'
})
)});
  main.variable(observer("option1")).define("option1", ["Generators", "viewof option1"], (G, _) => G.input(_));
  main.variable(observer("viewof option2")).define("viewof option2", ["radio"], function(radio){return(
radio({
  options: [
    { label: 'cases', value: 'timeline_cases'},
    { label: 'death', value: 'timeline_death'}
  ],
  value: 'timeline_cases'
})
)});
  main.variable(observer("option2")).define("option2", ["Generators", "viewof option2"], (G, _) => G.input(_));
  main.variable(observer("viewof time")).define("viewof time", ["Scrubber","dates"], function(Scrubber,dates){return(
Scrubber(dates, {
  loop: false,
  autoplay: false,
  initial: 999
})
)});
  main.variable(observer("time")).define("time", ["Generators", "viewof time"], (G, _) => G.input(_));
  main.variable(observer("main_plot")).define("main_plot", ["d3","mutable map","option1","timeline_data","path","option2","covid_estimates_with_shape","us_states_shape","us_states_id","hover_interaction","click_interaction"], function(d3,$0,option1,timeline_data,path,option2,covid_estimates_with_shape,us_states_shape,us_states_id,hover_interaction,click_interaction)
{
  let svg = d3.create('svg').attr("viewBox", [0, 0, 975, 610]);
  let g = svg.append('g').attr('class','root')
  $0.value = g
  // Create path for each counties
  if(option1 == 'canvas'){
    const county_shape = g.append('g')
    .selectAll('path')
    .data(timeline_data)
    .enter()
    .append('path')
    .attr('fill', '#f4f3f0')
    .attr('fill-opacity', 0.75)
    .attr('stroke','black')
    .attr('stroke-width',0.05)
    .attr('d', path)
    .attr('class', 'county_contour')
    .attr('id',d=>{
      if(typeof(d.county) != 'undefined')
      {
        let state = d.state.toLowerCase()
        let county = d.county.toLowerCase()
        return `${state}_${county}`
      }
      else
        return 'undefined'
    }) // state name with county name
    .append('title')
    .text(d=>`State: ${d.state}\nCounty: ${d.county}\nConfirmed: ${d.confirmed}\nDeath: ${d.death}\nPopulation: ${d.population}\nUpdated Date: ${d.date}\nCounty FIPS: ${d.id}`) // state, county name
  }
  else if(option1 == 'timeline'){
    const county_shape = g.append('g')
    .selectAll('path')
    .data(timeline_data)
    .enter()
    .append('path')
    .attr("fill", (d,i) => {
      if(option2 === 'timeline_cases') {
        return d.confirmed > 0 ? d3.interpolateReds(Math.log(d.confirmed)/Math.log(10) / (51/10)) : 'white'
      } else if (option2 === 'timeline_death') {
        return d.death > 0 ? d3.interpolateBlues(Math.log(d.death)/Math.log(10) / (51/10)) : 'white'
      }
    })
    .attr('fill-opacity', 0.75)
    .attr('stroke','none')
    .attr('d', path)
    .attr('class', 'county_contour')
    .attr('id',d=>`${d.state},${d.county}`) // state name with county name
    .append('title')
    .text(d=>`State: ${d.state}\nCounty: ${d.county}\nConfirmed: ${d.confirmed}\nDeath: ${d.death}\nPopulation: ${d.population}\nUpdated Date: ${d.date}\nCounty FIPS: ${d.id}`) // state, county name   
    }
  else if(option1 == 'prediction'){
    const county_shape = g.append('g')
    .selectAll('path')
    .data(covid_estimates_with_shape)
    .enter()
    .append('path')
    .attr("fill", (d,i) => {
      return d.estimate_infection_avg > 0 ? d3.interpolateReds(Math.log(d.estimate_infection_avg)/Math.log(10) / (51/10)) : 'white'
    })
    .attr('fill-opacity', 0.75)
    .attr('stroke','none')
    .attr('d', path)
    .attr('class', 'county_contour')
    .attr('id',d=>`${d.state},${d.county}`) // state name with county name
    .append('title')
    .text(d=>`State: ${d.state}\nNext week's daily Average Infection Prediction: ${d.estimate_infection_avg}\nTotal Case: ${d.total_cases}\nTotal Deaths: ${d.total_deaths}\n Total Tested: ${d.total_tested}\nDaily Positive 7 Days Average: ${d.daily_positive_7day_avg}\nDaily Death 7 Days Average: ${d.daily_deaths_7day_avg}\nDaily Tests 7 Days Average: ${d.daily_tests_7day_avg}\nPositive Rate 7 Days Average: ${d.positive_rate_7day_avg}`) 
  }

  if(option1 != 'prediction'){
    // Create path for each states
    const state_shape = g.append('g')
    .selectAll('path')
    .data(us_states_shape)
    .enter()
    .append('path')
    .attr("fill", 'none')
    .attr('class', 'state_contour')
    .attr('id', d=>{
      let state = us_states_id.get(d.id).name.toLowerCase()
      state = state.replace(/\s+/g, '_')
      return state
    })
    .attr("stroke", 'none')
    .attr("stroke-linejoin", "round")
    .attr("d", path)
    .attr("stroke-width", 0.5)


    hover_interaction(g)
    click_interaction(g)
  }

  return svg.node()
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`
# New Cases In Recent 30 Days
`
)});
  main.variable(observer()).define(["md","selected_state"], function(md,selected_state){return(
md`
 * State: ${selected_state.toUpperCase()}
`
)});
  main.variable(observer()).define(["d3","choosen_state_cumu_group","line_mark_focus","hue_scale","county_color_legends","label_tweak","y_scale","x_scale","grid","line_hover_interaction","line_click_interaction","legend_click_interaction"], function(d3,choosen_state_cumu_group,line_mark_focus,hue_scale,county_color_legends,label_tweak,y_scale,x_scale,grid,line_hover_interaction,line_click_interaction,legend_click_interaction)
{
  let svg = d3.create('svg')
    .attr('width', 1000).attr('height', 550)
  let focus = svg.append('g')
  .attr("class", "focus")
  .attr('transform', 'translate(50,10)')
  
  let focus_path = focus.selectAll('path')
  .data(choosen_state_cumu_group)
  .enter()
  .append('path')
    .attr('d', d => line_mark_focus(d.values))
  .attr("fill", "none")
  .attr("stroke", (d,i) => d3.hcl(hue_scale(d.key),55,55))
  .attr("stroke-width", 2)
  .attr('stroke-opacity',0.75)
  // .attr("stroke-linejoin", "round")
  // .attr("stroke-linecap", "round")
  .attr('class', 'county_line')
  .attr('id', d=>'line-'+d.key)
  .append('title')
  .text(d=>`County: ${d.key.toUpperCase()}`)

  let legend_scale = d3.scaleBand().domain(county_color_legends).range([0, 150]).paddingInner(0.5)
  let legend_elements = focus.append('g').attr('transform', 'translate(630,0)')
  let legends = legend_elements.selectAll('rect').data(county_color_legends).enter();
  
  legends.append('rect')
    .attr('transform', (d,i) => {
    let k = parseInt(i/40)
    let h = (i) % 40 - k*5
    return `translate(${100*k},${10*h})`
  })
    .attr('y', d => legend_scale(d))
    .attr('width', 3*legend_scale.bandwidth())
    .attr('height', 3*legend_scale.bandwidth())
    .attr('fill', d => d3.hcl(hue_scale(d),55,55))
    .attr('id', d=> 'rect-' + d)
    .attr('class', 'legend_rect')
  
  legends.append('text')
    .attr('transform', (d,i) => {
    let k = parseInt(i/40)
    // console.log(k,i)
    let h = (i) % 40 - k*5
    return `translate(${100*k},${10*h})`
  })
    .attr('x', (20+legend_scale.bandwidth()))
    .attr('y', d => legend_scale(d)+3*legend_scale.bandwidth()/2)
    .attr('class', 'legend_text')
    .attr('id', d=> 'text-' + d)
    .text(d => d).attr('alignment-baseline', 'middle')
    .call(label_tweak, d3.hcl(0,0,40), '12px', 'left')
  
  
  focus.append('g')
    .attr('class', 'yaxis')
    .call(d3.axisLeft(y_scale).ticks(20))
    .append('text')
    .text('Ratio of new cases and local population(10000X)')
    .attr('transform','translate(-35,250) rotate(270)')
    .attr('text-anchor', 'middle')
    .attr('fill', d3.hcl(0,0,30))
    .attr('font-weight', 'bold')
    .attr('font-size', 16)
  focus.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,500)')
    .call(d3.axisBottom(x_scale).tickFormat(d3.timeFormat('%a %d')))
    .append('text')
    .text('Time')
    .attr('transform','translate(600,35)')
    .attr('text-anchor', 'middle')
    .attr('fill', d3.hcl(0,0,30))
    .attr('font-weight', 'bold')
    .attr('font-size', 16)
  focus.append('g')
    .call(grid)
  
  line_hover_interaction(focus)
  line_click_interaction(focus)
  legend_click_interaction(legends)
  return svg.node()
}
);
  main.variable(observer()).define(["md","selected_county"], function(md,selected_county){return(
md`
 * County: ${selected_county.toUpperCase()}
`
)});
  main.variable(observer("bar_plot")).define("bar_plot", ["d3","choosen_county_cumu","bar_x_scale","bar_y_scale"], function(d3,choosen_county_cumu,bar_x_scale,bar_y_scale)
{
  let svg = d3.create('svg').attr('width', 700).attr('height', 360)
  let g = svg.append('g')
    .attr('transform', 'translate(50,10)');
  g.selectAll('rect')
    .data(choosen_county_cumu)
    .enter()
    .append('rect')
    .attr('x', (d,i)=>bar_x_scale(d.date))
    .attr('y', d=>{
    if(d.new_cases != 0)
      return bar_y_scale(d.new_cases)
    else
      return 300
  })
    .attr('width', bar_x_scale.bandwidth())
    .attr('height', (d,i)=>{
      if(d.new_cases != 0)
        return 300-bar_y_scale(d.new_cases)
      else
        return 0
    })
    .attr('fill', (d,i) => {
      if(i > 0)
        return 'steelblue'
      else
        return 'none'
    })
    .attr('stroke', d3.hcl(0,0,30)).attr('stroke-width', .4)
    .append('title')
    .text(d=>`Cases: ${d.new_cases}`);
  
  g.selectAll('rect2')
    .data(choosen_county_cumu)
    .enter()
    .append('rect')
    .attr('x', (d,i)=>bar_x_scale(d.date))
    .attr('y', d=>{
    if(d.cases_diff != 0)
      return bar_y_scale(d.new_cases)  

    else
      return 300
  })
    .attr('width', bar_x_scale.bandwidth())
    .attr('height', (d,i)=>{
      if(d.cases_diff != 0)
        return 300 - bar_y_scale(d.cases_diff)
      else
        return 0
    })
    .attr('fill', (d,i) => {
      if(i > 0)
        return 'orange'
      else
        return 'none'
    })
    .attr('stroke', d3.hcl(0,0,30)).attr('stroke-width', .4)
    .append('title')
    .text(d=>`Today's New Case: ${d.cases_diff}`);

  g.append('g')
    .attr('id', 'bar_xaxis')
    .attr('transform', 'translate(0,300)')
    .call(d3.axisBottom(bar_x_scale).tickFormat(d3.timeFormat("%a %d")))
    .selectAll('text')
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
  g.selectAll('#bar_xaxis')
    .append('text')
    .text('Time')
    .attr('transform','translate(600,50)')
    .attr('text-anchor', 'middle')
    .attr('fill', d3.hcl(0,0,30))
    .attr('font-weight', 'bold')
    .attr('font-size', 16)
  g.append('g')
    .attr('id', 'bar_yaxis')
    .attr('transform', 'translate(0,0)')
    .call(d3.axisLeft(bar_y_scale))
    .append('text')
    .text('New cases')
    .attr('transform','translate(-35,150) rotate(270)')
    .attr('text-anchor', 'middle')
    .attr('fill', d3.hcl(0,0,30))
    .attr('font-weight', 'bold')
    .attr('font-size', 16)
    // .attr("color", "steelblue")
  return svg.node()
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`# Interactions`
)});
  main.variable(observer("hover_interaction")).define("hover_interaction", ["d3","us_states_id"], function(d3,us_states_id){return(
(g) => {
  let temp_color
  g.selectAll('.county_contour')
  .on('mouseover',function(d) {
    // console.log(d)
    temp_color = d3.select(this).style('fill')
    d3.select(this)
      .attr('stroke','white')
      .attr('stroke-width',1)
      .attr('fill-opacity', 1)
      .raise()

    let this_state = us_states_id.get(d.id.slice(0, 2)).name.toLowerCase()
    this_state = this_state.replace(/\s+/g, '_')
    let selector = '.state_contour#'+this_state
    
    d3.select(selector)
      .attr('stroke-width',2.5)
      .attr('stroke','red')
      .raise()
  })
  .on('mouseout',function(d) {   
    d3.select(this)
      .attr('stroke','none')
      .attr('fill-opacity', 0.75)
      .attr('fill', temp_color)
      .lower()
    let this_state = us_states_id.get(d.id.slice(0, 2)).name.toLowerCase()
    this_state = this_state.replace(/\s+/g, '_')
    let selector = '.state_contour#'+this_state
    d3.select(selector)
      .attr('stroke-width',0.5)
      .attr('stroke','none')
      .lower()
  })
}
)});
  main.variable(observer("line_hover_interaction")).define("line_hover_interaction", ["d3"], function(d3){return(
(g) => {
  let temp_color
  let temp_rect_color
  let temp_text_color
  g.selectAll('.county_line')
  .on('mouseover',function(d){
    temp_color = d3.select(this).style('stroke')

    d3.selectAll('.county_line')
      .attr('stroke-opacity', 0.1)
    d3.select(this)
    // .attr('stroke','black')
      .attr('stroke-width',5)
      .attr('stroke-opacity', 1)
      .raise()
    // console.log(d)
    let county_name = d.key
    let select_rect_id = '#rect-' + county_name
    let select_text_id = '#text-' + county_name
    temp_rect_color = d3.select(select_rect_id).style('fill')
    temp_text_color = d3.select(select_text_id).style('fill')
    d3.select(select_rect_id)
      .attr('fill', 'red')
    d3.select(select_text_id)
      .attr('fill', 'red')
      .attr('font-weight', 'bold')
  })
  .on('mouseout',function(d){
    d3.select(this)
      // .attr('stroke',temp_color)
      .attr('stroke-width',2)
      .lower()
    d3.selectAll('.county_line')
      .attr('stroke-opacity', 0.75)
    let county_name = d.key
    let select_rect_id = '#rect-' + county_name
    let select_text_id = '#text-' + county_name
    d3.select(select_rect_id)
      .attr('fill', temp_rect_color)
    d3.select(select_text_id)
      .attr('fill', temp_text_color)
      .attr('font-weight', 'normal')
  })
}
)});
  main.variable(observer("line_click_interaction")).define("line_click_interaction", ["mutable selected_county","map","option2","d3"], function($0,map,option2,d3){return(
(g) => {
  g.selectAll('.county_line')
  .on('click',function(d){
    let county_name = d.key
    $0.value = county_name
    let state_name = d.values[0].state

    let selector = 'path#' + state_name + '_' + county_name
    
    let selection = map.select(selector)
      .attr("fill", d => {
      if(option2 === 'timeline_cases') {
        return d.confirmed > 0 ? d3.interpolateReds(Math.log(d.confirmed)/Math.log(10) / 6) : 'white'
      } else if (option2 === 'timeline_death') {
        return d.death > 0 ? d3.interpolateBlues(Math.log(d.death)/Math.log(10) / 5) : 'white'
      }
    })
    let state_selector = '.state_contour#' + state_name.replace(/\s+/g, '_')

    let is_selected = map.select(state_selector).classed('is_selected')

    map.select(state_selector)
      .attr('stroke-width',1)
      .attr('stroke','red')
      .raise()
  })
}
)});
  main.variable(observer("click_interaction")).define("click_interaction", ["us_states_id","us_county_id","mutable selected_state","mutable selected_county"], function(us_states_id,us_county_id,$0,$1){return(
(g) => {
  g.selectAll('.county_contour')
    .on('click',function(d){
    let this_state = us_states_id.get(d.id.slice(0, 2)).name
    let this_county = us_county_id.get(d.id).name
    // console.log(this_state, this_county)
    $0.value = this_state.toLowerCase()
    $1.value = this_county.toLowerCase()
  })
}
)});
  main.variable(observer("legend_click_interaction")).define("legend_click_interaction", ["d3","selected_state","map","option2"], function(d3,selected_state,map,option2){return(
(g) => {
  g.selectAll('.legend_rect')
    .on('click', function(d){
    let this_county = d3.select(this).attr('id')
    let county = this_county.split('-')[1]
    let selector = '.county_line#line-' + county
    let id = 'line-' + county
    d3.selectAll('.county_line')
      .attr('stroke-opacity', 0.05)
    d3.selectAll(selector)
      .attr('stroke-opacity', 1)
  })
    g.selectAll('.legend_text')
    .on('click', function(d){
    let this_county = d3.select(this).attr('id')
    let county = this_county.split('-')[1]
    let selector = '.county_line#line-' + county
    let id = 'line-' + county
    d3.selectAll('.county_line')
      .attr('stroke-opacity', 0.05);
    d3.selectAll(selector)
      .attr('stroke-opacity', 1);
      
      let selector2 = '.county_contour#' + selected_state + '_' + county
      console.log(selector2)
      map.select(selector2)
      .attr("fill", d => {
        if(option2 === 'timeline_cases') {
          return d.confirmed > 0 ? d3.interpolateReds(Math.log(d.confirmed)/Math.log(10) / 6) : 'white'
        } else if (option2 === 'timeline_death') {
          return d.death > 0 ? d3.interpolateBlues(Math.log(d.death)/Math.log(10) / 5) : 'white'
        }
      });
  })
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Implementation`
)});
  main.variable(observer("path")).define("path", ["d3"], function(d3){return(
d3.geoPath()
)});
  main.define("initial index", ["dates","time"], function(dates,time){return(
dates.indexOf(time)
)});
  main.variable(observer("mutable index")).define("mutable index", ["Mutable", "initial index"], (M, _) => new M(_));
  main.variable(observer("index")).define("index", ["mutable index"], _ => _.generator);
  main.define("initial selected_state", function(){return(
'tennessee'
)});
  main.variable(observer("mutable selected_state")).define("mutable selected_state", ["Mutable", "initial selected_state"], (M, _) => new M(_));
  main.variable(observer("selected_state")).define("selected_state", ["mutable selected_state"], _ => _.generator);
  main.define("initial selected_county", function(){return(
"davidson"
)});
  main.variable(observer("mutable selected_county")).define("mutable selected_county", ["Mutable", "initial selected_county"], (M, _) => new M(_));
  main.variable(observer("selected_county")).define("selected_county", ["mutable selected_county"], _ => _.generator);
  main.define("initial map", function(){return(
''
)});
  main.variable(observer("mutable map")).define("mutable map", ["Mutable", "initial map"], (M, _) => new M(_));
  main.variable(observer("map")).define("map", ["mutable map"], _ => _.generator);
  main.variable(observer("line_mark_focus")).define("line_mark_focus", ["d3","x_scale","y_scale"], function(d3,x_scale,y_scale){return(
d3.line()
  .x(d => x_scale(d.date))
  .y((d,i) => y_scale(d.ratio))
)});
  main.variable(observer("x_scale")).define("x_scale", ["d3","choosen_state_time_extend"], function(d3,choosen_state_time_extend){return(
d3.scaleTime().domain(choosen_state_time_extend).range([0,600])
)});
  main.variable(observer("y_scale")).define("y_scale", ["d3","choosen_state_ratio_extent"], function(d3,choosen_state_ratio_extent){return(
d3.scaleLinear().domain(choosen_state_ratio_extent).range([500,0])
)});
  main.variable(observer("hue_scale")).define("hue_scale", ["d3","choosen_state_county_color_mapping"], function(d3,choosen_state_county_color_mapping){return(
d3.scalePoint().domain(choosen_state_county_color_mapping).range([0,360]).padding(.5)
)});
  main.variable(observer("bar_time_scale")).define("bar_time_scale", ["d3","choosen_county_time_extend"], function(d3,choosen_county_time_extend){return(
d3.scaleTime()
  .domain(choosen_county_time_extend)
  .range([0,600])
)});
  main.variable(observer("bar_x_scale")).define("bar_x_scale", ["d3","bar_time_scale"], function(d3,bar_time_scale){return(
d3.scaleBand()
  // .domain(d3.timeDay.range(...bar_time_scale.domain()))
  .domain(d3.timeDay.range(bar_time_scale.domain()[0],new Date(bar_time_scale.domain()[1].getTime() + 60 * 60 * 24 * 1000)))
  .range([0,600])
  .paddingInner(0.1)
)});
  main.variable(observer("bar_y_scale")).define("bar_y_scale", ["d3","choosen_county_cases_extend"], function(d3,choosen_county_cases_extend){return(
d3.scaleLinear()
  .domain(choosen_county_cases_extend)
  .range([300,0])
)});
  main.variable(observer("label_tweak")).define("label_tweak", ["d3"], function(d3){return(
(text_selection, fill, size, anchor) => {
  text_selection
    .attr('text-anchor', anchor ? anchor : 'middle')
    .attr('fill', fill ? fill : d3.hcl(0,0,30))
    .attr('font-size', size ? size : '8px').attr('font-weight', 'regular')
}
)});
  main.variable(observer("grid")).define("grid", ["x_scale","y_scale"], function(x_scale,y_scale){return(
g => g
.attr("stroke-opacity", 0.3)
.attr("stroke-width", 2)
.attr("stroke", "#ccc")

.call(g => g.append("g")
      .selectAll("line")
      .data(x_scale.ticks())
      .join("line")
      .attr("x1", d => x_scale(d))
      .attr("x2", d => x_scale(d))
      .attr("y1", 0)
      .attr("y2", 500))
.call(g => g.append("g")
      .selectAll("line")
      .data(y_scale.ticks())
      .join("line")
      .attr("y1", d => y_scale(d))
      .attr("y2", d => y_scale(d))
      .attr("x1", 0)
      .attr("x2", 600))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Data`
)});
  main.variable(observer("timeline_data")).define("timeline_data", ["us_counties_shape_with_population","nyc_ids","grouped_timeline_data","index"], function(us_counties_shape_with_population,nyc_ids,grouped_timeline_data,index){return(
us_counties_shape_with_population.map(d=>{
  let confirmed = nyc_ids.includes(d.id) ? grouped_timeline_data[index].filter(f=>f.county==='New York City')[0] : grouped_timeline_data[index][grouped_timeline_data[index].map(g=>g.id).indexOf(d.id)] || {}
  return ({...d, ...confirmed})
})
)});
  main.variable(observer("choosen_state_data")).define("choosen_state_data", ["choosen_state_latest_month","selected_state"], function(choosen_state_latest_month,selected_state){return(
choosen_state_latest_month(selected_state)
)});
  main.variable(observer("choosen_state_clean_data")).define("choosen_state_clean_data", ["clean_data_helper","choosen_state_data"], function(clean_data_helper,choosen_state_data){return(
clean_data_helper(choosen_state_data)
)});
  main.variable(observer("choosen_state_cumu")).define("choosen_state_cumu", ["calculate_new_case_state","choosen_state_clean_data"], function(calculate_new_case_state,choosen_state_clean_data){return(
calculate_new_case_state(choosen_state_clean_data)
)});
  main.variable(observer("choosen_state_cumu_group")).define("choosen_state_cumu_group", ["d3","choosen_state_cumu"], function(d3,choosen_state_cumu){return(
d3.nest().key(d=>d.county).entries(choosen_state_cumu)
)});
  main.variable(observer("choosen_county_cumu")).define("choosen_county_cumu", ["choosen_state_cumu","selected_county"], function(choosen_state_cumu,selected_county){return(
choosen_state_cumu.filter(d=>d.county==selected_county.replace(/\s+/g, '_'))
)});
  main.variable(observer("choosen_county_time_extend")).define("choosen_county_time_extend", ["d3","choosen_county_cumu"], function(d3,choosen_county_cumu){return(
d3.extent(choosen_county_cumu, (d,i)=>d.date)
)});
  main.variable(observer("choosen_state_time_extend")).define("choosen_state_time_extend", ["d3","choosen_state_clean_data"], function(d3,choosen_state_clean_data){return(
d3.extent(choosen_state_clean_data, (d,i)=>d.date)
)});
  main.variable(observer("choosen_county_cases_extend")).define("choosen_county_cases_extend", ["d3","choosen_county_cumu"], function(d3,choosen_county_cumu){return(
d3.extent(choosen_county_cumu, (d,i)=>d.new_cases)
)});
  main.variable(observer("choosen_state_ratio_extent")).define("choosen_state_ratio_extent", ["d3","choosen_state_cumu"], function(d3,choosen_state_cumu){return(
d3.extent(choosen_state_cumu, (d,i)=>d.ratio)
)});
  main.variable(observer("choosen_state_county_color_mapping")).define("choosen_state_county_color_mapping", ["choosen_state_cumu_group"], function(choosen_state_cumu_group){return(
choosen_state_cumu_group.map(d => d.key)
)});
  main.variable(observer("county_color_legends")).define("county_color_legends", ["d3","choosen_state_cumu_group"], function(d3,choosen_state_cumu_group){return(
d3.set(choosen_state_cumu_group, d=>d.key).values()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Global Variables`
)});
  main.variable(observer("pad")).define("pad", function(){return(
50
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Helper functions`
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.timeFormat('%x')
)});
  main.variable(observer("choosen_state_latest_month")).define("choosen_state_latest_month", ["d3"], function(d3){return(
(stateName) => {
  let url = 'https://corona.lmao.ninja/v2/historical/usacounties/' + stateName + '?lastdays=30'
  let json = d3.json(url, function(error, json){
    if (error) throw error
    else
      return json
  })
  return json
}
)});
  main.variable(observer("calculate_new_case_state")).define("calculate_new_case_state", function(){return(
(arr) => {
  let new_arr = []
  for(let i=0;i<arr.length;i+=30)
  {
    let base = arr[i].cases + arr[i].deaths
    let base2 = arr[i].cases
    for(let j=i;j<i+30;j++)
    {
      let d = arr[j]
      let cases = d.cases + d.deaths - base
      let cases_diff = Math.abs(d.cases - base2)
      base2 = d.cases
      // let ratio = parseFloat((10000000 * cases / arr[i].population).toPrecision(5))
      
      let ratio = parseInt((10e3 * cases / arr[i].population))
      new_arr.push({state:d.state,county:d.county,new_cases:cases,ratio:ratio,date:d.date,cases_diff:cases_diff})
    }
  }
  return new_arr
}
)});
  main.variable(observer("clean_data_helper")).define("clean_data_helper", ["reverse_state_id","us_counties_id","population_each_county"], function(reverse_state_id,us_counties_id,population_each_county){return(
(arr) => {
  let new_arr = []
  let cleaned_arr = arr.filter(d => d.county != 'unassigned' && !d.county.includes('out of'))
  cleaned_arr.forEach(d=>{
    let state = d.province
    let county = d.county.replace(/\s+/g, '_')
    let cases = d.timeline.cases
    let deaths = d.timeline.deaths
    let len = Object.keys(cases).length
    let state_id = reverse_state_id.get(state)
    let counties = us_counties_id.get(state_id)
    let county_id = counties.find(g=>g.county.toLowerCase()==county.toLowerCase()) ? (counties.find(g=>g.county.toLowerCase()==county.toLowerCase())).county_id : 0

    let population = 0
    if(county_id)
      population = population_each_county.get(county_id)
    else
      population = 0
    for (let keys in cases){
      let date = new Date(keys)
      new_arr.push({state_id: state_id,state:state,county_id:county_id,county:county,cases:cases[keys],deaths:deaths[keys],population:population,date:date})
    }
  })
  return new_arr
}
)});
  main.variable(observer("us_counties_id")).define("us_counties_id", ["us_counties_shape","us_states_id","d3"], function(us_counties_shape,us_states_id,d3)
{
  let new_arr = []
  us_counties_shape.forEach(d=>{
    let id = d.id
    let state_id = id.slice(0, 2)
    let county = d.properties.name.replace(/\s+/g, '_')
    // let county = d.properties.name
    let state = us_states_id.get(state_id).name.replace(/\s+/g, '_')
    // let state = us_states_id.get(state_id).name
    new_arr.push({county_id: d.id, state_id: state_id, state:state, county:county})
  })
  let grouped_county_id = d3.nest()
  .key(d=>d.state_id)
  .entries(new_arr)
  let ret = new Map(grouped_county_id.map(d=>[d.key,d.values]))
  return ret
  // return grouped_county_id
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`# Imports`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  const child1 = runtime.module(define1);
  main.import("us_states_id", child1);
  main.import("us_county_id", child1);
  main.import("us_states_shape", child1);
  main.import("us_counties_shape", child1);
  main.import("covid_estimates_with_shape", child1);
  main.import("reverse_state_id", child1);
  main.import("us_counties_shape_with_population", child1);
  main.import("date_period", "dates", child1);
  main.import("nyc_ids", child1);
  main.import("population_each_county", child1);
  main.import("grouped_timeline_data", child1);
  const child2 = runtime.module(define2);
  main.import("radio", child2);
  const child3 = runtime.module(define3);
  main.import("Scrubber", child3);
  main.variable(observer("back_up_code")).define("back_up_code", function()
{
  //   let zoom = d3.zoom()
  //   .scaleExtent([1, 25])
  //   .extent([[0,0],[600,500]])
  //   .translateExtent([[0,-Infinity],[600, Infinity]])
  //   .on('zoom',zoomed)
  // function zoomed(event) {
  //   let xz = event.transform.rescaleX(x_scale)
  //   let yz = event.transform.rescaleY(y_scale)
  //   x_scale.copy().domain(xz.domain());
  //   y_scale.copy().domain(yz.domain());
  //   // redraw paths with new x zoomed scale
  //   path.attr('d', d=>line_mark_focus(d.values))
  // }
  // focus.call(zoom)
  
// color_legend = (i) => {
//     let chroma_val = 60;
//     let lightness_val = 50;
//     return chroma.hcl((i%6/6) * 360, chroma_val, lightness_val);
//   }

  // let context = svg.append("g")
  // .attr("class", "context")
  // .attr("transform", 'translate(50,600)')
  
//   let context_path = context.selectAll('path')
//   .data(choosen_state_cumu_group)
//   .enter()
//   .append('path')
//   .attr('d', d => line_mark_context(d.values))
//   .attr("fill", "none")
//   .attr("stroke", (d,i) => d3.hcl(hue_scale(d.key),55,55))
//   .attr("stroke-width", 2)
//   .attr('stroke-opacity',0.5)
//   .attr("stroke-linejoin", "round")
//   .attr("stroke-linecap", "round")

//   context.append('g')
//     .attr('id', 'xaxis_context')
//     .attr('transform', 'translate(0,100)')
//     .call(d3.axisBottom(x_scale).ticks(10).tickFormat(d3.timeFormat('%a %d')))
//     .append('text')
//     .text('Time')
//     .attr('transform','translate(600,35)')
//     .attr('text-anchor', 'middle')
//     .attr('fill', d3.hcl(0,0,30))
//     .attr('font-weight', 'bold')
//     .attr('font-size', 16)
  
//   brush_interaction = (g) => {
//   let brush = d3.brushX().extent([[0,0],[600,98]])
//   brush.on('brush', brushed)
//   .on('end', brushended)
//   let default_selection = [500, x_scale.range()[1]]
  
//   function brushed() {
//     let selection = d3.event.selection
//     let event = d3.event.selection.map(x_scale.invert, x_scale)
//     x_scale.domain(event);
//     // d3.selectAll('.county_line').attr('d', d=>line_mark_focus(d.values))
//     d3.selectAll('#xaxis').call(d3.axisBottom(x_scale).tickFormat(d3.timeFormat('%a %d')))
//   }
//   let brush_area = g.append('g')
//     .call(brush)
//     .call(brush.move, default_selection)
//   function brushended() {
//     let selection = d3.event.selection
//     if (!selection) {
//       brush_area.call(brush.move, default_selection);
//     }
//   }
// }
  
}
);
  return main;
}
