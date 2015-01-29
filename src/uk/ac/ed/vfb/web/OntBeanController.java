package uk.ac.ed.vfb.web;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.model.PubBean;
import uk.ac.ed.vfb.service.OntBeanManager;
import uk.ac.ed.vfb.service.PubBeanManager;

/**
 * Controller providing the front-end for the /do/ont_bean.html view.
 * @author nmilyaev
 */

public class OntBeanController implements Controller {
	private OntBeanManager obm;
	private PubBeanManager pbm;
	private static final Log LOG = LogFactory.getLog(OntBeanController.class);

	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		ModelAndView modelAndView = new ModelAndView("do/ontBean");
		String id = req.getParameter("fbId");
		OntBean ob = this.obm.getBeanForId(id);		
		//LOG.debug("For Id: " + ob.getId().toString());
		//List<PubBean> pbList = pbm.getBeanListById(ob.getId());
		List<PubBean> pbList = pbm.getBeanListByRefIds(ob.getRefs());
		LOG.debug("Found publications:" + pbList.size());
		List<String> synonyms = ob.getSynonyms();
		for (String syn:synonyms){
			if (syn.contains("FlyBase:FBrf")){
				for (PubBean bean:pblist){
					syn = syn.replace("FlyBase:"+ bean.getId(), bean.getMiniref());
				}
			}
			//if (syn.contains(":FBrf")){
			// ADD OTHER REFS	
			//}
		}
		ob.setSynonyms(synonyms);
		modelAndView.addObject("ontBean", ob);
		modelAndView.addObject("refs", pbList);
		return modelAndView;
	}

	public void setObm(OntBeanManager manager) {
		this.obm = manager;
	}

	public void setPbm(PubBeanManager pbm) {
		this.pbm = pbm;
	}
	
}
