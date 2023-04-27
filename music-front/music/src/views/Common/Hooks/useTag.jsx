import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function useTag(initialOption = {}, tagDefs = []) {
    const navigate = useNavigate();
    const location = useLocation();

    const [tags, setTags] = useState(
        tagDefs.map((tagDef) => ({
            param: tagDef.param,
            option: { name: initialOption[tagDef.param].name, value: initialOption[tagDef.param].value },
        }))
    );

    useEffect(() => {
        //以当前url更新tag
        const searchParams = new URLSearchParams(location.search);
        setTags(
            tags.map((tag) => ({
                ...tag,
                option: {
                    name: searchParams.get(tagDefs.find((tagDef) => tagDef.param === tag.param).param)
                        ? (tagDefs.find((tagDef) => tagDef.param === tag.param).options).find((option) => option.value === parseInt(searchParams.get(tagDefs.find((tagDef) => tagDef.param === tag.param).param))).name
                        : initialOption[tagDefs.find((tagDef) => tagDef.param === tag.param).param].name,
                    value: searchParams.get(tagDefs.find((tagDef) => tagDef.param === tag.param).param) || initialOption[tagDefs.find((tagDef) => tagDef.param === tag.param).param].value
                }
            }))
        );
    }, [location]);

    const handleTagClick = (param, option) => {
        const searchParams = new URLSearchParams();

        tags.forEach((tag) => {
            //setState是异步的,不要在handleTagClick中修改state并使用tag.option,这是无效的
            //但是这里可以初始化searchParams.set的结构
            searchParams.set(tagDefs.find((tagDef) => tagDef.param === tag.param).param, tag.option.value);
        });
        //对searchParams.set结构修改当前点击的参数
        searchParams.set(tagDefs.find((tagDef) => tagDef.param === param).param, option);

        navigate({ search: searchParams.toString() });
    };

    return { tags, handleTagClick };
}

export default function TagComponent({ initialOption = {}, tagDefs = [], styleDefs = {} }) {
    const { tags, handleTagClick } = useTag(initialOption, tagDefs)

    return (
        <div className={styleDefs.tag}>
            {
                tags.map((tag) => (
                    <div key={tag.param} className={styleDefs.list}>
                        {
                            tagDefs.find((tagDef) => tagDef.param === tag.param).options.map((option) => (
                                <a key={option.name} href='#'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleTagClick(tag.param, option.value)
                                    }}
                                    className={tag.option.name === option.name ? styleDefs.itemSelected : styleDefs.item}
                                >
                                    {option.name}
                                </a>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}