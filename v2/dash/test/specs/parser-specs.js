/*! grafana - v1.6.1 - 2014-09-02
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define(["services/graphite/parser"],function(a){describe("when parsing",function(){it("simple metric expression",function(){var b=new a("metric.test.*.asd.count"),c=b.getAst();expect(c.type).to.be("metric"),expect(c.segments.length).to.be(5),expect(c.segments[0].value).to.be("metric")}),it("simple metric expression with numbers in segments",function(){var b=new a("metric.10.15_20.5"),c=b.getAst();expect(c.type).to.be("metric"),expect(c.segments.length).to.be(4),expect(c.segments[1].value).to.be("10"),expect(c.segments[2].value).to.be("15_20"),expect(c.segments[3].value).to.be("5")}),it("simple metric expression with curly braces",function(){var b=new a("metric.se1-{count, max}"),c=b.getAst();expect(c.type).to.be("metric"),expect(c.segments.length).to.be(2),expect(c.segments[1].value).to.be("se1-{count,max}")}),it("simple metric expression with curly braces at start of segment and with post chars",function(){var b=new a("metric.{count, max}-something.count"),c=b.getAst();expect(c.type).to.be("metric"),expect(c.segments.length).to.be(3),expect(c.segments[1].value).to.be("{count,max}-something")}),it("simple function",function(){var b=new a("sum(test)"),c=b.getAst();expect(c.type).to.be("function"),expect(c.params.length).to.be(1)}),it("simple function2",function(){var b=new a("offset(test.metric, -100)"),c=b.getAst();expect(c.type).to.be("function"),expect(c.params[0].type).to.be("metric"),expect(c.params[1].type).to.be("number")}),it("simple function with string arg",function(){var b=new a("randomWalk('test')"),c=b.getAst();expect(c.type).to.be("function"),expect(c.params.length).to.be(1),expect(c.params[0].type).to.be("string")}),it("function with multiple args",function(){var b=new a("sum(test, 1, 'test')"),c=b.getAst();expect(c.type).to.be("function"),expect(c.params.length).to.be(3),expect(c.params[0].type).to.be("metric"),expect(c.params[1].type).to.be("number"),expect(c.params[2].type).to.be("string")}),it("function with nested function",function(){var b=new a("sum(scaleToSeconds(test, 1))"),c=b.getAst();expect(c.type).to.be("function"),expect(c.params.length).to.be(1),expect(c.params[0].type).to.be("function"),expect(c.params[0].name).to.be("scaleToSeconds"),expect(c.params[0].params.length).to.be(2),expect(c.params[0].params[0].type).to.be("metric"),expect(c.params[0].params[1].type).to.be("number")}),it("function with multiple series",function(){var b=new a("sum(test.test.*.count, test.timers.*.count)"),c=b.getAst();expect(c.type).to.be("function"),expect(c.params.length).to.be(2),expect(c.params[0].type).to.be("metric"),expect(c.params[1].type).to.be("metric")}),it("function with templated series",function(){var b=new a("sum(test.[[server]].count)"),c=b.getAst();expect(c.message).to.be(void 0),expect(c.params[0].type).to.be("metric"),expect(c.params[0].segments[1].type).to.be("template"),expect(c.params[0].segments[1].value).to.be("server")}),it("invalid metric expression",function(){var b=new a("metric.test.*.asd."),c=b.getAst();expect(c.message).to.be("Expected metric identifier instead found end of string"),expect(c.pos).to.be(19)}),it("invalid function expression missing closing paranthesis",function(){var b=new a("sum(test"),c=b.getAst();expect(c.message).to.be("Expected closing paranthesis instead found end of string"),expect(c.pos).to.be(9)}),it("unclosed string in function",function(){var b=new a("sum('test)"),c=b.getAst();expect(c.message).to.be("Unclosed string parameter"),expect(c.pos).to.be(11)}),it("handle issue #69",function(){var b=new a("cactiStyle(offset(scale(net.192-168-1-1.192-168-1-9.ping_value.*,0.001),-100))"),c=b.getAst();expect(c.type).to.be("function")}),it("handle float function arguments",function(){var b=new a("scale(test, 0.002)"),c=b.getAst();expect(c.type).to.be("function"),expect(c.params[1].type).to.be("number"),expect(c.params[1].value).to.be(.002)})})});