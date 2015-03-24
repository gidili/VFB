package uk.ac.ed.vfb.web;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;


import java.nio.charset.StandardCharsets;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class tomcatController implements Controller {
  private static final Log LOG = LogFactory.getLog(tomcatController.class);
  
  public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
    ModelAndView modelAndView = new ModelAndView("logs/tomcat");
    String logfile = "/disk/data/tomcat/fly/webapps/vfb/logs/tomcat.log";
    List<String> data = new ArrayList<String>();
    try{
      LOG.debug("Loading info from meta file: " + getFileForId(getTemplateId()).replace("composite.wlz", "meta.json"));
      List<String> lines = Files.readAllLines(Paths.get(logfile), StandardCharsets.UTF_8);
      if (lines.size() > 500){
        List<String> data = new ArrayList<String>();
        for (i=lines.size()-500; i<lines.size(); i++){
          data.add(lines.get(i));
        }
      lines = data;  
      }
    }catch(Exception ex){
    LOG.error("Error loading log from file: " + logfile);
    ex.printStackTrace();
    }
    modelAndView.addObject("log", lines);
    return modelAndView;
  }
  
}
